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
exports.DestinationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const destination_entity_1 = require("../entities/destination.entity");
const property_entity_1 = require("../entities/property.entity");
let DestinationsService = class DestinationsService {
    destinationsRepository;
    propertyRepository;
    constructor(destinationsRepository, propertyRepository) {
        this.destinationsRepository = destinationsRepository;
        this.propertyRepository = propertyRepository;
    }
    async findAll() {
        const curated = await this.destinationsRepository.find();
        const properties = await this.propertyRepository.find({
            where: { status: 'PUBLISHED' },
            select: ['location']
        });
        const propertyCities = new Set();
        properties.forEach(p => {
            if (p.location) {
                const city = p.location.split(',')[0].trim();
                if (city)
                    propertyCities.add(city);
            }
        });
        const curatedNames = new Set(curated.map(d => d.name.toLowerCase()));
        const dynamicDestinations = [];
        propertyCities.forEach(city => {
            if (!curatedNames.has(city.toLowerCase())) {
                const d = new destination_entity_1.Destination();
                d.id = 0;
                d.name = city;
                d.region = 'World';
                d.type = 'city';
                d.imageUrl = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                dynamicDestinations.push(d);
            }
        });
        return [...curated, ...dynamicDestinations];
    }
    create(destination) {
        return this.destinationsRepository.save(destination);
    }
};
exports.DestinationsService = DestinationsService;
exports.DestinationsService = DestinationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(destination_entity_1.Destination)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DestinationsService);
//# sourceMappingURL=destinations.service.js.map