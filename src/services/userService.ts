import supabase from '../config/supabase';
import bcrypt from 'bcrypt';

export const createUserAndProfile = async (
  name: string,
  email: string,
  hashedPassword: string,
  role: string
) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword, role }])
    .select();

  if (userError) throw userError;

  const user = userData[0];

  const profileTable = `${role}_profile`;
  const profileData = {
    user_id: user.id,
  };

  const { data: profileDataResponse, error: profileError } = await supabase
    .from(profileTable)
    .insert([profileData]);

  if (profileError) throw profileError;

  return user;
};

export const findOneUser = async (email: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.log('El usuario no existe en la db', error);
    return { success: false, message: 'El usuario no existe en la db' };
  }

  const isPasswordMatch = await bcrypt.compare(password, data.password);

  if (!isPasswordMatch) {
    console.log('Invalid credentials.');
    return { success: false, message: 'Invalid credentials' };
  }
  return data;
};

export const findUserById = async (userId: string) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('Error al buscar el usuario:', userError);
    throw userError;
  }

  return userData;
};

export const findUserProfile = async (userId: string, role: string) => {
  const tableName = `${role}_profile`;

  const { data: profileData, error: profileError } = await supabase
    .from(tableName)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (profileError) {
    console.error('Error al buscar el perfil del usuario:', profileError);
    throw profileError;
  }

  return profileData;
};
