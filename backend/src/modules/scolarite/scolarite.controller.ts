import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ScolariteService } from './scolarite.service';
import { 
  CreateDossierScolaireDto,
  CreatePaiementDto,
  CreateFraisScolaireDto,
  CreateDocumentScolaireDto
} from './dto/create-dossier-scolaire.dto';
import { UpdateDossierScolaireDto } from './dto/update-dossier-scolaire.dto';
import { StatutPaiement } from './schemas/dossier-scolaire.schema';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';

@Controller('scolarite')
@UseGuards(TenantGuard)
export class ScolariteController {
  constructor(private readonly scolariteService: ScolariteService) {}

  @Post('dossiers')
  async createDossier(
    @Body() createDossierDto: CreateDossierScolaireDto,
    @CurrentTenant() tenantId: string
  ) {
    createDossierDto.tenantId = tenantId;
    return await this.scolariteService.createDossier(createDossierDto);
  }

  @Get('dossiers')
  async findAllDossiers(
    @CurrentTenant() tenantId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('classe') classe?: string,
    @Query('anneeScolaire') anneeScolaire?: string,
    @Query('statutPaiement') statutPaiement?: StatutPaiement,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Page et limit doivent être des nombres positifs');
    }

    const filters = {
      classe,
      anneeScolaire,
      statutPaiement,
      search,
    };

    return await this.scolariteService.findAllByTenant(
      tenantId,
      pageNum,
      limitNum,
      filters
    );
  }

  @Get('dossiers/:id')
  async findOneDossier(@Param('id') id: string) {
    return await this.scolariteService.findOne(id);
  }

  @Get('dossiers/matricule/:matricule')
  async findDossierByMatricule(
    @Param('matricule') matricule: string,
    @CurrentTenant() tenantId: string
  ) {
    return await this.scolariteService.findByMatricule(tenantId, matricule);
  }

  @Patch('dossiers/:id')
  async updateDossier(
    @Param('id') id: string,
    @Body() updateDossierDto: UpdateDossierScolaireDto
  ) {
    return await this.scolariteService.update(id, updateDossierDto);
  }

  @Delete('dossiers/:id')
  async removeDossier(@Param('id') id: string) {
    return await this.scolariteService.remove(id);
  }

  @Post('dossiers/:id/frais')
  async addFrais(
    @Param('id') id: string,
    @Body() fraisDto: CreateFraisScolaireDto
  ) {
    return await this.scolariteService.addFrais(id, fraisDto);
  }

  @Post('dossiers/:id/paiements')
  async addPaiement(
    @Param('id') id: string,
    @Body() paiementDto: CreatePaiementDto
  ) {
    return await this.scolariteService.addPaiement(id, paiementDto);
  }

  @Post('dossiers/:id/documents')
  async addDocument(
    @Param('id') id: string,
    @Body() documentDto: CreateDocumentScolaireDto
  ) {
    return await this.scolariteService.addDocument(id, documentDto);
  }

  @Get('statistics')
  async getStatistics(
    @CurrentTenant() tenantId: string,
    @Query('anneeScolaire') anneeScolaire?: string
  ) {
    return await this.scolariteService.getStatistics(tenantId, anneeScolaire);
  }

  @Get('reports/financial')
  async getFinancialReport(
    @CurrentTenant() tenantId: string,
    @Query('anneeScolaire') anneeScolaire: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!anneeScolaire) {
      throw new BadRequestException('L\'année scolaire est requise');
    }

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return await this.scolariteService.generateFinancialReport(
      tenantId,
      anneeScolaire,
      start,
      end
    );
  }

  // Endpoints pour obtenir des données utiles pour les formulaires
  @Get('classes')
  async getAvailableClasses(@CurrentTenant() tenantId: string) {
    // Cette méthode pourrait être étendue pour récupérer les classes depuis le module academic
    return {
      classes: [
        'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2',
        '6ème', '5ème', '4ème', '3ème',
        'Seconde', 'Première', 'Terminale'
      ]
    };
  }

  @Get('frais-types')
  async getFraisTypes() {
    return {
      types: [
        'Inscription',
        'Scolarité',
        'Uniforme',
        'Fournitures',
        'Cantine',
        'Transport',
        'Activités',
        'Examens',
        'Certificat',
        'Autre'
      ]
    };
  }

  @Get('methodes-paiement')
  async getMethodesPaiement() {
    return {
      methodes: [
        'Espèces',
        'Virement bancaire',
        'Orange Money',
        'MTN Mobile Money',
        'Moov Money',
        'Chèque',
        'Carte bancaire'
      ]
    };
  }

  @Get('annees-scolaires')
  async getAnneesScolaires(@CurrentTenant() tenantId: string) {
    // Générer les 3 dernières années et les 2 prochaines
    const currentYear = new Date().getFullYear();
    const annees: string[] = [];
    
    for (let i = -3; i <= 2; i++) {
      const year = currentYear + i;
      annees.push(`${year}-${year + 1}`);
    }
    
    return { annees };
  }
} 