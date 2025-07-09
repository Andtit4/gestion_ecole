import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  DossierScolaire, 
  DossierScolaireDocument, 
  StatutPaiement,
  Paiement,
  FraisScolaire,
  DocumentScolaire
} from './schemas/dossier-scolaire.schema';
import { 
  CreateDossierScolaireDto,
  CreatePaiementDto,
  CreateFraisScolaireDto,
  CreateDocumentScolaireDto
} from './dto/create-dossier-scolaire.dto';
import { UpdateDossierScolaireDto } from './dto/update-dossier-scolaire.dto';

@Injectable()
export class ScolariteService {
  constructor(
    @InjectModel(DossierScolaire.name) 
    private dossierScolaireModel: Model<DossierScolaireDocument>,
  ) {}

  // Créer un nouveau dossier scolaire
  async createDossier(createDossierDto: CreateDossierScolaireDto): Promise<DossierScolaireDocument> {
    try {
      const dossier = new this.dossierScolaireModel(createDossierDto);
      return await dossier.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Un dossier avec ce numéro de matricule existe déjà pour cet établissement');
      }
      throw error;
    }
  }

  // Récupérer tous les dossiers d'un tenant
  async findAllByTenant(
    tenantId: string, 
    page: number = 1, 
    limit: number = 20,
    filters: {
      classe?: string;
      anneeScolaire?: string;
      statutPaiement?: StatutPaiement;
      search?: string;
    } = {}
  ): Promise<{
    dossiers: DossierScolaireDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = { tenantId, actif: true };

    // Appliquer les filtres
    if (filters.classe) {
      query.classe = filters.classe;
    }

    if (filters.anneeScolaire) {
      query.anneeScolaire = filters.anneeScolaire;
    }

    if (filters.statutPaiement) {
      query.statutPaiement = filters.statutPaiement;
    }

    if (filters.search) {
      query.$or = [
        { nomEleve: { $regex: filters.search, $options: 'i' } },
        { numeroMatricule: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [dossiers, total] = await Promise.all([
      this.dossierScolaireModel
        .find(query)
        .populate('etudiantId', 'firstName lastName email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.dossierScolaireModel.countDocuments(query)
    ]);

    return {
      dossiers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Récupérer un dossier par ID
  async findOne(id: string): Promise<DossierScolaireDocument> {
    const dossier = await this.dossierScolaireModel
      .findById(id)
      .populate('etudiantId', 'firstName lastName email phone')
      .exec();

    if (!dossier) {
      throw new NotFoundException('Dossier scolaire non trouvé');
    }

    return dossier;
  }

  // Récupérer un dossier par numéro de matricule
  async findByMatricule(tenantId: string, numeroMatricule: string): Promise<DossierScolaireDocument> {
    const dossier = await this.dossierScolaireModel
      .findOne({ tenantId, numeroMatricule, actif: true })
      .populate('etudiantId', 'firstName lastName email phone')
      .exec();

    if (!dossier) {
      throw new NotFoundException('Dossier scolaire non trouvé avec ce numéro de matricule');
    }

    return dossier;
  }

  // Mettre à jour un dossier
  async update(id: string, updateDossierDto: UpdateDossierScolaireDto): Promise<DossierScolaireDocument> {
    const dossier = await this.dossierScolaireModel
      .findByIdAndUpdate(id, updateDossierDto, { new: true, runValidators: true })
      .populate('etudiantId', 'firstName lastName email')
      .exec();

    if (!dossier) {
      throw new NotFoundException('Dossier scolaire non trouvé');
    }

    return dossier;
  }

  // Supprimer un dossier (soft delete)
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.dossierScolaireModel
      .findByIdAndUpdate(id, { actif: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException('Dossier scolaire non trouvé');
    }

    return { message: 'Dossier scolaire supprimé avec succès' };
  }

  // Ajouter des frais à un dossier
  async addFrais(id: string, fraisDto: CreateFraisScolaireDto): Promise<DossierScolaireDocument> {
    const dossier = await this.findOne(id);
    const nouveauFrais: FraisScolaire = {
      type: fraisDto.type,
      montant: fraisDto.montant,
      description: fraisDto.description,
      obligatoire: fraisDto.obligatoire || false,
      dateEcheance: fraisDto.dateEcheance ? new Date(fraisDto.dateEcheance) : new Date()
    };
    dossier.frais.push(nouveauFrais);
    return await dossier.save();
  }

  // Ajouter un paiement à un dossier
  async addPaiement(id: string, paiementDto: CreatePaiementDto): Promise<DossierScolaireDocument> {
    const dossier = await this.findOne(id);
    
    // Vérifier que le montant du paiement ne dépasse pas le reste à payer
    if (paiementDto.montant > dossier.fraisRestants) {
      throw new BadRequestException('Le montant du paiement dépasse le reste à payer');
    }

    dossier.paiements.push({
      ...paiementDto,
      datePaiement: new Date(paiementDto.datePaiement),
      dateEnregistrement: new Date()
    } as Paiement);
    
    return await dossier.save();
  }

  // Ajouter un document à un dossier
  async addDocument(id: string, documentDto: CreateDocumentScolaireDto): Promise<DossierScolaireDocument> {
    const dossier = await this.findOne(id);
    dossier.documents.push({
      ...documentDto,
      dateCreation: new Date(),
      dateExpiration: documentDto.dateExpiration ? new Date(documentDto.dateExpiration) : undefined
    } as DocumentScolaire);
    
    return await dossier.save();
  }

  // Obtenir les statistiques d'un tenant
  async getStatistics(tenantId: string, anneeScolaire?: string): Promise<{
    activeDossiers: number;
    fraisCollectes: number;
    fraisEnAttente: number;
    documentsTotal: number;
    repartitionParStatut: any;
    repartitionParClasse: any;
  }> {
    const query: any = { tenantId, actif: true };
    
    if (anneeScolaire) {
      query.anneeScolaire = anneeScolaire;
    }

    const [
      activeDossiers,
      statsFinancieres,
      documentsCount,
      repartitionStatut,
      repartitionClasse
    ] = await Promise.all([
      this.dossierScolaireModel.countDocuments(query),
      
      this.dossierScolaireModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            fraisCollectes: { $sum: '$fraisPayes' },
            fraisEnAttente: { $sum: '$fraisRestants' }
          }
        }
      ]),

      this.dossierScolaireModel.aggregate([
        { $match: query },
        { $unwind: '$documents' },
        { $count: 'total' }
      ]),

      this.dossierScolaireModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$statutPaiement',
            count: { $sum: 1 }
          }
        }
      ]),

      this.dossierScolaireModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$classe',
            count: { $sum: 1 },
            fraisTotaux: { $sum: '$fraisTotaux' },
            fraisPayes: { $sum: '$fraisPayes' }
          }
        }
      ])
    ]);

    const stats = statsFinancieres[0] || { fraisCollectes: 0, fraisEnAttente: 0 };
    const docsCount = documentsCount[0]?.total || 0;

    return {
      activeDossiers,
      fraisCollectes: stats.fraisCollectes,
      fraisEnAttente: stats.fraisEnAttente,
      documentsTotal: docsCount,
      repartitionParStatut: repartitionStatut,
      repartitionParClasse: repartitionClasse
    };
  }

  // Générer un rapport financier
  async generateFinancialReport(
    tenantId: string, 
    anneeScolaire: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const query: any = { tenantId, anneeScolaire, actif: true };
    
    let paiementFilter: any = {};
    if (startDate && endDate) {
      paiementFilter = {
        'paiements.datePaiement': {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    const pipeline: any[] = [
      { $match: query },
      { $unwind: '$paiements' }
    ];

    if (Object.keys(paiementFilter).length > 0) {
      pipeline.push({ $match: paiementFilter });
    }

    pipeline.push(
      {
        $group: {
          _id: {
            annee: { $year: '$paiements.datePaiement' },
            mois: { $month: '$paiements.datePaiement' },
            methodePaiement: '$paiements.methodePaiement'
          },
          totalMontant: { $sum: '$paiements.montant' },
          nombreTransactions: { $sum: 1 }
        }
      },
      { $sort: { '_id.annee': 1, '_id.mois': 1 } }
    );

    const results = await this.dossierScolaireModel.aggregate(pipeline);
    return results;
  }
} 