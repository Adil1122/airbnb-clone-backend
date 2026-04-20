"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_entity_1 = require("../entities/service.entity");
let ServicesService = class ServicesService {
    servicesRepository;
    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }
    async findAll() {
        return this.servicesRepository.find();
    }
    async search(params) {
        const { location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children } = params;
        const query = this.servicesRepository.createQueryBuilder('service');
        if (location && location.trim() !== '' && !location.includes('Search destinations')) {
            const keyword = location.split(/[, ]+/)[0];
            query.andWhere('service.location LIKE :keyword', { keyword: `%${keyword}%` });
        }
        if (startDate && startDate !== 'Add dates') {
            try {
                const sDate = new Date(startDate);
                if (!isNaN(sDate.getTime())) {
                    query.andWhere('(service.availableFrom IS NULL OR service.availableFrom <= :sDate)', { sDate });
                    if (endDate && endDate !== 'Add dates') {
                        const eDate = new Date(endDate);
                        if (!isNaN(eDate.getTime())) {
                            query.andWhere('(service.availableTo IS NULL OR service.availableTo >= :eDate)', { eDate });
                        }
                    }
                }
            }
            catch (e) {
                console.error('[ERROR] Parsing dates in service search:', e);
            }
        }
        if (monthsCount) {
            const today = new Date();
            const future = new Date();
            future.setMonth(today.getMonth() + monthsCount);
            query.andWhere('service.availableFrom <= :today', { today });
            query.andWhere('service.availableTo >= :future', { future });
        }
        if (flexibleMonths && flexibleMonths.length > 0) {
            const monthMap = {
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const conditions = flexibleMonths.map((m, i) => {
                const monthIdx = monthMap[m];
                return `(service.availableFrom <= :eom${i} AND service.availableTo >= :som${i})`;
            }).join(' OR ');
            const parameters = {};
            flexibleMonths.forEach((m, i) => {
                const monthIdx = monthMap[m];
                parameters[`som${i}`] = new Date(2026, monthIdx, 1);
                parameters[`eom${i}`] = new Date(2026, monthIdx + 1, 0);
            });
            query.andWhere(`(${conditions})`, parameters);
        }
        if (adults) {
            query.andWhere('service.maxAdults >= :adults', { adults });
        }
        if (children) {
            query.andWhere('service.maxChildren >= :children', { children });
        }
        return query.getMany();
    }
    async findOne(id) {
        return this.servicesRepository.findOne({ where: { id } });
    }
    create(service) {
        const newService = this.servicesRepository.create(service);
        return this.servicesRepository.save(newService);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map