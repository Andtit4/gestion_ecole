import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  IsDateString, 
  IsEnum,
  ValidateNested,
  IsArray,
  Min,
  IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatutPaiement } from '../schemas/dossier-scolaire.schema';

export class CreateFraisScolaireDto {
  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  montant: number;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  obligatoire?: boolean = false;

  @IsDateString()
  @IsOptional()
  dateEcheance?: string;
}

export class CreatePaiementDto {
  @IsNumber()
  @Min(0)
  montant: number;

  @IsDateString()
  datePaiement: string;

  @IsString()
  methodePaiement: string;

  @IsString()
  @IsOptional()
  numeroTransaction?: string;

  @IsString()
  @IsOptional()
  remarques?: string;
}

export class CreateDocumentScolaireDto {
  @IsString()
  nom: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  cheminFichier?: string;

  @IsDateString()
  @IsOptional()
  dateExpiration?: string;

  @IsString()
  @IsOptional()
  statut?: string = 'valide';
}

export class CreateDossierScolaireDto {
  @IsString()
  tenantId: string;

  @IsMongoId()
  etudiantId: string;

  @IsString()
  nomEleve: string;

  @IsString()
  numeroMatricule: string;

  @IsString()
  classe: string;

  @IsString()
  anneeScolaire: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFraisScolaireDto)
  @IsOptional()
  frais?: CreateFraisScolaireDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePaiementDto)
  @IsOptional()
  paiements?: CreatePaiementDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentScolaireDto)
  @IsOptional()
  documents?: CreateDocumentScolaireDto[] = [];

  @IsString()
  @IsOptional()
  remarques?: string;

  @IsBoolean()
  @IsOptional()
  actif?: boolean = true;
} 