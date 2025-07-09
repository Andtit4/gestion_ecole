import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScolariteService } from './scolarite.service';
import { ScolariteController } from './scolarite.controller';
import { DossierScolaire, DossierScolaireSchema } from './schemas/dossier-scolaire.schema';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DossierScolaire.name, schema: DossierScolaireSchema }
    ]),
    TenantModule
  ],
  controllers: [ScolariteController],
  providers: [ScolariteService],
  exports: [ScolariteService],
})
export class ScolariteModule {} 