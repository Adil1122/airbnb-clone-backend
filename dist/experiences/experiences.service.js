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
exports.ExperiencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const experience_entity_1 = require("../entities/experience.entity");
let ExperiencesService = class ExperiencesService {
    experiencesRepository;
    constructor(experiencesRepository) {
        this.experiencesRepository = experiencesRepository;
    }
    async findAll() {
        return this.experiencesRepository.find();
    }
    async search(params) {
        const { location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children } = params;
        const query = this.experiencesRepository.createQueryBuilder('experience');
        if (location)
            query.andWhere('experience.location LIKE :location', { location: `%${location}%` });
        if (startDate) {
            const sDate = new Date(startDate);
            query.andWhere('experience.availableFrom <= :sDate', { sDate });
            if (endDate) {
                const eDate = new Date(endDate);
                query.andWhere('experience.availableTo >= :eDate', { eDate });
            }
        }
        if (monthsCount) {
            const today = new Date();
            const future = new Date();
            future.setMonth(today.getMonth() + monthsCount);
            query.andWhere('experience.availableFrom <= :today', { today });
            query.andWhere('experience.availableTo >= :future', { future });
        }
        if (flexibleMonths && flexibleMonths.length > 0) {
            const monthMap = {
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const conditions = flexibleMonths.map((m, i) => {
                const monthIdx = monthMap[m];
                return `(experience.availableFrom <= :eom${i} AND experience.availableTo >= :som${i})`;
            }).join(' OR ');
            const parameters = {};
            flexibleMonths.forEach((m, i) => {
                const monthIdx = monthMap[m];
                parameters[`som${i}`] = new Date(2026, monthIdx, 1);
                parameters[`eom${i}`] = new Date(2026, monthIdx + 1, 0);
            });
            query.andWhere(`(${conditions})`, parameters);
        }
        if (adults)
            query.andWhere('experience.maxAdults >= :adults', { adults });
        if (children)
            query.andWhere('experience.maxChildren >= :children', { children });
        return query.getMany();
    }
    create(experience) {
        return this.experiencesRepository.save(experience);
    }
};
exports.ExperiencesService = ExperiencesService;
exports.ExperiencesService = ExperiencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExperiencesService);
//# sourceMappingURL=experiences.service.js.map