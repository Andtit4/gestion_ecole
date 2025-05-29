-- AlterTable
ALTER TABLE `reportcard` ADD COLUMN `financialStatus` ENUM('PENDING', 'PAID', 'LATE', 'EXEMPTED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `FeeType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isRecurrent` BOOLEAN NOT NULL DEFAULT false,
    `frequency` ENUM('ONCE', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `classId` VARCHAR(191) NULL,
    `level` VARCHAR(191) NULL,
    `year` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FeeGroup_classId_idx`(`classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeItem` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `dueDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `mandatory` BOOLEAN NOT NULL DEFAULT true,
    `feeTypeId` VARCHAR(191) NOT NULL,
    `feeGroupId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FeeItem_feeTypeId_idx`(`feeTypeId`),
    INDEX `FeeItem_feeGroupId_idx`(`feeGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `feeItemId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'PARTIAL', 'LATE', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `dueDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FeeAssignment_studentId_idx`(`studentId`),
    INDEX `FeeAssignment_feeItemId_idx`(`feeItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `status` ENUM('PENDING', 'PAID', 'PARTIAL', 'LATE', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `dueDate` DATETIME(3) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `issuedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    INDEX `Invoice_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceFeeAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `feeAssignmentId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InvoiceFeeAssignment_invoiceId_idx`(`invoiceId`),
    INDEX `InvoiceFeeAssignment_feeAssignmentId_idx`(`feeAssignmentId`),
    UNIQUE INDEX `InvoiceFeeAssignment_invoiceId_feeAssignmentId_key`(`invoiceId`, `feeAssignmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` ENUM('CASH', 'CHEQUE', 'BANK_TRANSFER', 'ONLINE', 'MOBILE_MONEY', 'OTHER') NOT NULL,
    `reference` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'PAID', 'PARTIAL', 'LATE', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `processingFee` DOUBLE NOT NULL DEFAULT 0,
    `invoiceId` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `receiptNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_receiptNumber_key`(`receiptNumber`),
    INDEX `Payment_invoiceId_idx`(`invoiceId`),
    INDEX `Payment_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentConfig` (
    `id` VARCHAR(191) NOT NULL,
    `latePaymentFeePercent` DOUBLE NOT NULL DEFAULT 0,
    `latePaymentGracePeriod` INTEGER NOT NULL DEFAULT 0,
    `receiptPrefix` VARCHAR(191) NOT NULL DEFAULT 'RECU-',
    `invoicePrefix` VARCHAR(191) NOT NULL DEFAULT 'FACT-',
    `allowPartialPayments` BOOLEAN NOT NULL DEFAULT true,
    `allowOnlinePayments` BOOLEAN NOT NULL DEFAULT true,
    `paymentMethods` VARCHAR(191) NOT NULL DEFAULT 'CASH,CHEQUE,BANK_TRANSFER,ONLINE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FeeGroup` ADD CONSTRAINT `FeeGroup_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeeItem` ADD CONSTRAINT `FeeItem_feeTypeId_fkey` FOREIGN KEY (`feeTypeId`) REFERENCES `FeeType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeeItem` ADD CONSTRAINT `FeeItem_feeGroupId_fkey` FOREIGN KEY (`feeGroupId`) REFERENCES `FeeGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeeAssignment` ADD CONSTRAINT `FeeAssignment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeeAssignment` ADD CONSTRAINT `FeeAssignment_feeItemId_fkey` FOREIGN KEY (`feeItemId`) REFERENCES `FeeItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceFeeAssignment` ADD CONSTRAINT `InvoiceFeeAssignment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceFeeAssignment` ADD CONSTRAINT `InvoiceFeeAssignment_feeAssignmentId_fkey` FOREIGN KEY (`feeAssignmentId`) REFERENCES `FeeAssignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `parent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
