import { repository } from '../../../repository';
import { ProfileDto, ProfileUpdateDto } from '../dto/profile.dto';


const save = async (profile: ProfileDto) => {
    return await repository.save('profile', profile);
}

const get = async (id: string): Promise<ProfileDto> => {
    const res = await repository.findById('profile', id);
    delete res.id;
    return res;
}

const update = async (profileUpdateDto: ProfileUpdateDto) => {
    const id = profileUpdateDto.id;
    delete profileUpdateDto.id;
    const res: boolean  = await repository.update('profile', profileUpdateDto, { id });
    if (!res) throw new Error('Profile not updated, try to update existing data');
    return {message: "Profile updated successfully"}
}

export { save, get, update };