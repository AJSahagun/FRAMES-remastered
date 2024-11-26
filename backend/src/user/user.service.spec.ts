import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../core/database/database.module';
import { UserService } from './user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let eventEmitter: EventEmitter2;

  const mockCreateUserDto: CreateUserDto = {
    firstName: 'firstname',
    lastName: 'lastname',
    srCode: 'mySrCode',
    middleName: 'middlename',
    suffix: 'suffix',
    department: 'department',
    program: 'program',
    encoding: [1],
  };

  const mockSaveUserSuccess = async () => ({ error: null });
  const mockSyncEncodingSuccess = async () => ({ error: null });

  const setupMocks = () => {
    jest.spyOn(service, 'saveUser').mockImplementation(mockSaveUserSuccess);
    jest.spyOn(service, 'syncEncoding').mockImplementation(mockSyncEncodingSuccess);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    setupMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create user related', () => {

    it('should successfully create user when both save and sync succeed', async () => {
      const result = await service.create(mockCreateUserDto);
      expect(result).toBeNull();

      // Verify saveUser was called with correct parameters
      expect(service.saveUser).toHaveBeenCalledWith(
        mockCreateUserDto.firstName,
        mockCreateUserDto.lastName,
        mockCreateUserDto.srCode,
        mockCreateUserDto.middleName,
        mockCreateUserDto.suffix,
        mockCreateUserDto.department,
        mockCreateUserDto.program,
      );

      // Verify syncEncoding was called with correct parameters
      const expectedName = `${mockCreateUserDto.firstName} ${mockCreateUserDto.middleName} ${mockCreateUserDto.lastName} ${mockCreateUserDto.suffix}`.trim();
      expect(service.syncEncoding).toHaveBeenCalledWith(
        expectedName,
        mockCreateUserDto.encoding,
        mockCreateUserDto.srCode,
      );
    });

    it('should return error if saveUser fails', async () => {
      const mockError = { error: 'Failed to save user' };
      // kunwari mag fail yung save function
      (service.saveUser as jest.Mock).mockResolvedValue({error:mockError});

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(mockError);
      expect(service.syncEncoding).not.toHaveBeenCalled();
    });

    it('should return error if syncEncoding fails', async () => {
      const mockError = { error: 'Failed to sync encoding' };
      (service.syncEncoding as jest.Mock).mockResolvedValue({error:mockError});

      const result = await service.create(mockCreateUserDto);
      expect(result).toEqual(mockError);
    });

    it('should handle user creation without middlename, suffix, department, and program', async () => {
      const userWithoutOptionals: CreateUserDto = {
        ...mockCreateUserDto,
        middleName:'',
        suffix:'',
        department:'',
        program:''
      };

      const result = await service.create(userWithoutOptionals);
      expect(result).toBeNull();
      
      const expectedName = 'firstname lastname';
      expect(service.syncEncoding).toHaveBeenCalledWith(
        expectedName,
        userWithoutOptionals.encoding,
        userWithoutOptionals.srCode,
      );
    });

    it('save function should return error if it receives existing srCode', async () => {
      const existingSchoolIdErr= "Existing school ID"
      jest.spyOn(service, 'saveUser').mockImplementation(async (first_name, last_name,school_id) => {
        return school_id=="existingSchoolId"? {error:existingSchoolIdErr}:{ error: null }
      });
      const userWithExistingSchoolId = { ...mockCreateUserDto, srCode: 'existingSchoolId' };
      const result = await service.create(userWithExistingSchoolId);
      expect(result).toEqual(existingSchoolIdErr)
      
    });
  });
});