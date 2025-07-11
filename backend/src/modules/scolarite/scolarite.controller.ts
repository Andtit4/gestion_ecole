import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
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
import { Types } from 'mongoose';

@Controller('scolarite')
export class ScolariteController {
  constructor(private readonly scolariteService: ScolariteService) {}

  private validateObjectId(id: string): void {
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide fourni');
    }
  }

  private extractTenantId(headers: any): string {
    const tenantId = headers['x-tenant-id'];
    if (!tenantId || typeof tenantId !== 'string') {
      throw new BadRequestException('Tenant ID requis dans les headers');
    }
    return tenantId;
  }

  @Post('dossiers')
  async createDossier(
    @Body() createDossierDto: CreateDossierScolaireDto,
    @Headers() headers: any
  ) {
    const tenantId = this.extractTenantId(headers);
    createDossierDto.tenantId = tenantId;
    return await this.scolariteService.createDossier(createDossierDto);
  }

  @Get('dossiers')
  async findAllDossiers(
    @Headers() headers: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('classe') classe?: string,
    @Query('anneeScolaire') anneeScolaire?: string,
    @Query('statutPaiement') statutPaiement?: StatutPaiement,
    @Query('search') search?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
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
    @Headers() headers: any
  ) {
    const tenantId = this.extractTenantId(headers);
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
    @Headers() headers: any,
    @Query('anneeScolaire') anneeScolaire?: string
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.scolariteService.getStatistics(tenantId, anneeScolaire);
  }

  @Get('reports/financial')
  async getFinancialReport(
    @Headers() headers: any,
    @Query('anneeScolaire') anneeScolaire: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
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
  async getAvailableClasses(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
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
  async getAnneesScolaires(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
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