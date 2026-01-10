// src/components/components.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { Component, ComponentType } from './component.model';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

// Mock Component model
jest.mock('./component.model');

describe('ComponentsService', () => {
  let service: ComponentsService;
  let mockComponent: any;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock implementation
    mockComponent = {
      query: jest.fn(() => mockComponent),
      findById: jest.fn(),
      insert: jest.fn(),
      patchAndFetchById: jest.fn(),
      deleteById: jest.fn(),
      where: jest.fn(() => mockComponent),
      andWhere: jest.fn(() => mockComponent),
      orWhere: jest.fn(() => mockComponent),
      orderBy: jest.fn(() => mockComponent),
      offset: jest.fn(() => mockComponent),
      limit: jest.fn(() => mockComponent),
      resultSize: jest.fn(),
      returning: jest.fn(() => mockComponent),
    };

    // Mock the static query method
    (Component.query as jest.Mock) = jest.fn(() => mockComponent);
    (Component as any).name = 'Component'; // Mock name property

    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentsService],
    }).compile();

    service = module.get<ComponentsService>(ComponentsService);
  });

  describe('findById', () => {
    it('should return a component if found', async () => {
      const mockComponentData = {
        id: 1,
        name: 'Test Component',
        type: ComponentType.CPU,
        manufacturer: 'Test Manufacturer',
        model: 'Test Model',
        price: 100,
        stock: 10,
      };

      mockComponent.findById.mockResolvedValue(mockComponentData);

      const result = await service.findById(1);

      expect(result).toEqual(mockComponentData);
      expect(Component.query).toHaveBeenCalled();
      expect(mockComponent.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if component not found', async () => {
      mockComponent.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createComponent', () => {
    it('should create and return a new component', async () => {
      const createDto: CreateComponentDto = {
        name: 'New Component',
        type: ComponentType.CPU,
        manufacturer: 'Test Manufacturer',
        model: 'Test Model',
        price: 200,
        stock: 5,
      };

      const mockCreatedComponent = {
        id: 1,
        ...createDto,
        specifications: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockComponent.insert.mockResolvedValue(mockCreatedComponent);
      mockComponent.returning.mockResolvedValue([mockCreatedComponent]);

      const result = await service.createComponent(createDto);

      expect(result).toEqual(mockCreatedComponent);
      expect(mockComponent.insert).toHaveBeenCalledWith({
        ...createDto,
        specifications: {},
        stock: 5,
      });
    });

    it('should set default values for optional fields', async () => {
      const createDto: CreateComponentDto = {
        name: 'New Component',
        type: ComponentType.CPU,
        manufacturer: 'Test Manufacturer',
        model: 'Test Model',
        price: 200,
        // stock not provided
      };

      const mockCreatedComponent = {
        id: 1,
        ...createDto,
        stock: 0, // Default value
        specifications: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockComponent.insert.mockResolvedValue(mockCreatedComponent);
      mockComponent.returning.mockResolvedValue([mockCreatedComponent]);

      const result = await service.createComponent(createDto);

      expect(result.stock).toBe(0);
      expect(result.specifications).toEqual({});
    });
  });

  describe('updateComponent', () => {
    it('should update and return the component', async () => {
      const updateDto: UpdateComponentDto = {
        name: 'Updated Component',
        price: 250,
      };

      const mockUpdatedComponent = {
        id: 1,
        name: 'Updated Component',
        type: ComponentType.CPU,
        manufacturer: 'Test Manufacturer',
        model: 'Test Model',
        price: 250,
        stock: 10,
        updatedAt: new Date(),
      };

      mockComponent.patchAndFetchById.mockResolvedValue(mockUpdatedComponent);

      const result = await service.updateComponent(1, updateDto);

      expect(result).toEqual(mockUpdatedComponent);
      expect(mockComponent.patchAndFetchById).toHaveBeenCalledWith(
        1,
        updateDto,
      );
    });

    it('should throw NotFoundException if component not found during update', async () => {
      mockComponent.patchAndFetchById.mockResolvedValue(null);

      await expect(
        service.updateComponent(999, { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStock', () => {
    it('should increase stock', async () => {
      const existingComponent = {
        id: 1,
        stock: 10,
      };

      const mockUpdatedComponent = {
        id: 1,
        stock: 15,
      };

      // Mock findById to return existing component
      jest
        .spyOn(service, 'findById')
        .mockResolvedValue(existingComponent as any);
      // Mock update to return updated component
      jest
        .spyOn(service, 'update')
        .mockResolvedValue(mockUpdatedComponent as any);

      const result = await service.updateStock(1, 5);

      expect(result.stock).toBe(15);
      expect(service.update).toHaveBeenCalledWith(1, { stock: 15 });
    });

    it('should decrease stock', async () => {
      const existingComponent = {
        id: 1,
        stock: 10,
      };

      const mockUpdatedComponent = {
        id: 1,
        stock: 5,
      };

      jest
        .spyOn(service, 'findById')
        .mockResolvedValue(existingComponent as any);
      jest
        .spyOn(service, 'update')
        .mockResolvedValue(mockUpdatedComponent as any);

      const result = await service.updateStock(1, -5);

      expect(result.stock).toBe(5);
    });

    it('should throw error for insufficient stock', async () => {
      const existingComponent = {
        id: 1,
        stock: 3,
      };

      jest
        .spyOn(service, 'findById')
        .mockResolvedValue(existingComponent as any);

      await expect(service.updateStock(1, -5)).rejects.toThrow(
        'Insufficient stock',
      );
    });
  });

  describe('searchComponents', () => {
    it('should search components by keyword', async () => {
      const mockComponents = [
        { id: 1, name: 'AMD Ryzen', manufacturer: 'AMD', model: 'Ryzen 9' },
        {
          id: 2,
          name: 'NVIDIA GPU',
          manufacturer: 'NVIDIA',
          model: 'RTX 3080',
        },
      ];

      mockComponent.where.mockImplementation(() => mockComponent);
      mockComponent.orWhere.mockImplementation(() => mockComponent);
      mockComponent.limit.mockResolvedValue(mockComponents);

      const result = await service.searchComponents('AMD');

      expect(result).toEqual(mockComponents);
      expect(mockComponent.where).toHaveBeenCalledWith(
        'name',
        'ilike',
        '%AMD%',
      );
      expect(mockComponent.orWhere).toHaveBeenCalledWith(
        'manufacturer',
        'ilike',
        '%AMD%',
      );
      expect(mockComponent.orWhere).toHaveBeenCalledWith(
        'model',
        'ilike',
        '%AMD%',
      );
    });
  });
});
