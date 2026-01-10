/* eslint-disable @typescript-eslint/unbound-method */
// src/components/components.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ComponentType } from './component.model';

describe('ComponentsController', () => {
  let controller: ComponentsController;
  let service: ComponentsService;

  const mockComponentsService = {
    findAllWithQuery: jest.fn(),
    findById: jest.fn(),
    createComponent: jest.fn(),
    updateComponent: jest.fn(),
    updateStock: jest.fn(),
    delete: jest.fn(),
    getComponentsByType: jest.fn(),
    searchComponents: jest.fn(),
  };

  const mockComponent = {
    id: 1,
    name: 'Test CPU',
    type: ComponentType.CPU,
    manufacturer: 'Intel',
    model: 'i9-13900K',
    specifications: { cores: 24, threads: 32 },
    price: 589.99,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentsController],
      providers: [
        {
          provide: ComponentsService,
          useValue: mockComponentsService,
        },
      ],
    }).compile();

    controller = module.get<ComponentsController>(ComponentsController);
    service = module.get<ComponentsService>(ComponentsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated components', async () => {
      const queryDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [mockComponent],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockComponentsService.findAllWithQuery.mockResolvedValue(expectedResult);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.findAllWithQuery).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findOne', () => {
    it('should return a component by id', async () => {
      mockComponentsService.findById.mockResolvedValue(mockComponent);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockComponent);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new component', async () => {
      const createDto: CreateComponentDto = {
        name: 'New CPU',
        type: ComponentType.CPU,
        manufacturer: 'AMD',
        model: 'Ryzen 9 7950X',
        price: 699.99,
        stock: 5,
      };

      mockComponentsService.createComponent.mockResolvedValue({
        ...mockComponent,
        ...createDto,
      });

      const result = await controller.create(createDto);

      expect(result).toEqual({
        ...mockComponent,
        ...createDto,
      });
      expect(service.createComponent).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the component', async () => {
      const updateDto: UpdateComponentDto = {
        name: 'Updated CPU',
        price: 649.99,
      };

      const updatedComponent = {
        ...mockComponent,
        ...updateDto,
      };

      mockComponentsService.updateComponent.mockResolvedValue(updatedComponent);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedComponent);
      expect(service.updateComponent).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('updateStock', () => {
    it('should update stock and return the component', async () => {
      const quantity = 5;
      const updatedComponent = {
        ...mockComponent,
        stock: mockComponent.stock + quantity,
      };

      mockComponentsService.updateStock.mockResolvedValue(updatedComponent);

      const result = await controller.updateStock(1, quantity);

      expect(result).toEqual(updatedComponent);
      expect(service.updateStock).toHaveBeenCalledWith(1, quantity);
    });
  });

  describe('remove', () => {
    it('should delete the component', async () => {
      mockComponentsService.delete.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('search', () => {
    it('should search components by keyword', async () => {
      const keyword = 'AMD';
      const searchResults = [mockComponent];

      mockComponentsService.searchComponents.mockResolvedValue(searchResults);

      const result = await controller.search(keyword);

      expect(result).toEqual(searchResults);
      expect(service.searchComponents).toHaveBeenCalledWith(keyword);
    });
  });

  describe('findByType', () => {
    it('should return components by type', async () => {
      const type = 'cpu';
      const typeResults = [mockComponent];

      mockComponentsService.getComponentsByType.mockResolvedValue(typeResults);

      const result = await controller.findByType(type);

      expect(result).toEqual(typeResults);
      expect(service.getComponentsByType).toHaveBeenCalledWith(type);
    });
  });
});
