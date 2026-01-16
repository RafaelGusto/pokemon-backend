import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerDto } from './dtos/create-trainer.dto';
import { UpdateTrainerDto } from './dtos/update-trainer.dto';
import { ViaCepService } from '../../integrations/viacep/viacep.service';

@Injectable()
export class TrainerService {
  private readonly logger = new Logger(TrainerService.name);

  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
    private readonly viaCepService: ViaCepService,
  ) {}

  async create(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
    const existingTrainer = await this.trainerRepository.findOne({
      where: { email: createTrainerDto.email },
    });

    if (existingTrainer) {
      throw new ConflictException('Email já cadastrado');
    }

    const trainer = this.trainerRepository.create(createTrainerDto);

    if (createTrainerDto.cep) {
      try {
        trainer.addressData = await this.viaCepService.getAddressByCep(
          createTrainerDto.cep,
        );
      } catch (error) {
        this.logger.warn(
          `Falha ao buscar CEP ${createTrainerDto.cep}: ${error.message}`,
        );
      }
    }

    return this.trainerRepository.save(trainer);
  }

  async findAll(): Promise<Trainer[]> {
    return this.trainerRepository.find({
      relations: ['teams'],
    });
  }

  async findById(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findOne({
      where: { id },
      relations: ['teams'],
    });

    if (!trainer) {
      throw new NotFoundException(`Treinador ${id} não encontrado`);
    }

    return trainer;
  }

  async update(
    id: string,
    updateTrainerDto: UpdateTrainerDto,
  ): Promise<Trainer> {
    const trainer = await this.findById(id);

    if (updateTrainerDto.email && updateTrainerDto.email !== trainer.email) {
      const existingTrainer = await this.trainerRepository.findOne({
        where: { email: updateTrainerDto.email },
      });

      if (existingTrainer) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    if (updateTrainerDto.cep && updateTrainerDto.cep !== trainer.cep) {
      try {
        trainer.addressData = await this.viaCepService.getAddressByCep(
          updateTrainerDto.cep,
        );
      } catch (error) {
        this.logger.warn(
          `Falha ao buscar CEP ${updateTrainerDto.cep}: ${error.message}`,
        );
      }
    }

    Object.assign(trainer, updateTrainerDto);
    return this.trainerRepository.save(trainer);
  }

  async delete(id: string): Promise<void> {
    const trainer = await this.findById(id);

    const teamsCount = await this.trainerRepository
      .createQueryBuilder('trainer')
      .leftJoinAndSelect('trainer.teams', 'team')
      .where('trainer.id = :id', { id })
      .andWhere('team.deletedAt IS NULL')
      .getCount();

    if (teamsCount > 0) {
      throw new BadRequestException(
        'Não é possível deletar um Treinador que possui Times ativos. Delete os Times primeiro.',
      );
    }

    await this.trainerRepository.softDelete(id);
  }

  async restore(id: string): Promise<Trainer> {
    await this.trainerRepository.restore(id);
    return this.findById(id);
  }

  async getAddressByCurrentCep(id: string): Promise<any> {
    const trainer = await this.findById(id);

    if (!trainer.cep) {
      throw new BadRequestException('Treinador não possui CEP cadastrado');
    }

    return this.viaCepService.getAddressByCep(trainer.cep);
  }

  async updateAddressFromCep(id: string, cep: string): Promise<Trainer> {
    const trainer = await this.findById(id);
    trainer.cep = cep;
    trainer.addressData = await this.viaCepService.getAddressByCep(cep);
    return this.trainerRepository.save(trainer);
  }
}
