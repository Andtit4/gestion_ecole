import { PartialType } from '@nestjs/mapped-types';
import { CreateDossierScolaireDto } from './create-dossier-scolaire.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { StatutPaiement } from '../schemas/dossier-scolaire.schema';

export class UpdateDossierScolaireDto extends PartialType(CreateDossierScolaireDto) {
  @IsEnum(StatutPaiement)
  @IsOptional()
  statutPaiement?: StatutPaiement;
} 