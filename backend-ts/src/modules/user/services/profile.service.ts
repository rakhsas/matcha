import { repository } from '../../../repository';
import { ProfileDto } from '../dto/profile.dto';


const save = async (profile: ProfileDto) => {
    return await repository.save('profile', profile);
}

const get = async (id: string): Promise<ProfileDto> => {
    const res = await repository.findById('profile', id);
    delete res.id;
    return res;
}

export { save, get };