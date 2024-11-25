import { repository } from '../../../repository';
import { ProfileDto } from '../dto/profile.dto';


const save = async (profile: ProfileDto) => {
    return await repository.save('profile', profile);
}

export { save };