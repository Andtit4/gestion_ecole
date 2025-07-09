import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DossierScolaireDocument = DossierScolaire & Document;

export enum StatutPaiement {
  PAYE = 'paye',
  PARTIELLEMENT_PAYE = 'partiellement_paye',
  IMPAYE = 'impaye',
}

@Schema({ collection: 'dossiers_scolaires' })
export class FraisScolaire {
  @Prop({ required: true })
  type: string; // Inscription, Scolarité, Uniform, etc.

  @Prop({ required: true })
  montant: number;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  obligatoire: boolean;

  @Prop({ default: Date.now })
  dateEcheance: Date;
}

@Schema({ collection: 'dossiers_scolaires' })
export class Paiement {
  @Prop({ required: true })
  montant: number;

  @Prop({ required: true })
  datePaiement: Date;

  @Prop({ required: true })
  methodePaiement: string; // Espèces, Virement, Mobile Money, etc.

  @Prop()
  numeroTransaction?: string;

  @Prop()
  remarques?: string;

  @Prop({ default: Date.now })
  dateEnregistrement: Date;
}

@Schema({ collection: 'dossiers_scolaires' })
export class DocumentScolaire {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  type: string; // Certificat, Bulletin, Attestation, etc.

  @Prop()
  cheminFichier?: string;

  @Prop({ default: Date.now })
  dateCreation: Date;

  @Prop()
  dateExpiration?: Date;

  @Prop({ default: 'valide' })
  statut: string;
}

@Schema({ 
  collection: 'dossiers_scolaires',
  timestamps: true 
})
export class DossierScolaire {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Student' })
  etudiantId: Types.ObjectId;

  @Prop({ required: true })
  nomEleve: string;

  @Prop({ required: true, unique: true })
  numeroMatricule: string;

  @Prop({ required: true })
  classe: string;

  @Prop({ required: true })
  anneeScolaire: string;

  @Prop({ type: [FraisScolaire], default: [] })
  frais: FraisScolaire[];

  @Prop({ type: [Paiement], default: [] })
  paiements: Paiement[];

  @Prop({ type: [DocumentScolaire], default: [] })
  documents: DocumentScolaire[];

  @Prop({ 
    type: String, 
    enum: StatutPaiement, 
    default: StatutPaiement.IMPAYE 
  })
  statutPaiement: StatutPaiement;

  @Prop({ default: 0 })
  fraisTotaux: number;

  @Prop({ default: 0 })
  fraisPayes: number;

  @Prop({ default: 0 })
  fraisRestants: number;

  @Prop()
  remarques?: string;

  @Prop({ default: true })
  actif: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DossierScolaireSchema = SchemaFactory.createForClass(DossierScolaire);

// Index pour améliorer les performances
DossierScolaireSchema.index({ tenantId: 1, anneeScolaire: 1 });
DossierScolaireSchema.index({ numeroMatricule: 1, tenantId: 1 }, { unique: true });
DossierScolaireSchema.index({ etudiantId: 1 });
DossierScolaireSchema.index({ statutPaiement: 1 });

// Middleware pour calculer automatiquement les totaux
DossierScolaireSchema.pre('save', function() {
  this.fraisTotaux = this.frais.reduce((total, frais) => total + frais.montant, 0);
  this.fraisPayes = this.paiements.reduce((total, paiement) => total + paiement.montant, 0);
  this.fraisRestants = this.fraisTotaux - this.fraisPayes;
  
  // Déterminer le statut de paiement
  if (this.fraisRestants <= 0) {
    this.statutPaiement = StatutPaiement.PAYE;
  } else if (this.fraisPayes > 0) {
    this.statutPaiement = StatutPaiement.PARTIELLEMENT_PAYE;
  } else {
    this.statutPaiement = StatutPaiement.IMPAYE;
  }
  
  this.updatedAt = new Date();
}); 