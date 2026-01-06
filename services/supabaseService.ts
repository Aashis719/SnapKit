import { supabase } from '../lib/supabase';
import { SocialKitResult } from '../types';

export const saveGeneration = async (
    userId: string,
    imageUrl: string,
    imagePublicId: string,
    inputs: any,
    result: SocialKitResult
) => {
    // 1. Save Image Record
    const { data: imageData, error: imageError } = await supabase
        .from('images')
        .insert({
            user_id: userId,
            cloudinary_url: imageUrl,
            cloudinary_public_id: imagePublicId,
            // You could extract width/height/format if you passed them
        })
        .select()
        .single(); 

    if (imageError) throw imageError;

    // 2. Save Generation Record
    const { error: genError } = await supabase
        .from('generations')
        .insert({
            user_id: userId,
            image_id: imageData.id,
            inputs,
            results: result
        });

    if (genError) throw genError;

    // 3. Decrement credits (optional, can be done via database trigger or edge function for security)
    // For MVP, we just track it.
};

export const getUserHistory = async (userId: string) => {
    const { data, error } = await supabase
        .from('generations')
        .select(`
      *,
      image:images(*)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const deleteGeneration = async (generationId: string) => {
    const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', generationId);

    if (error) throw error;
};

/**
 * Get the Gemini API key for the current user
 */
export const getUserApiKey = async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('gemini_api_key')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data?.gemini_api_key || null;
};

/**
 * Update or set the Gemini API key for the current user
 */
export const updateUserApiKey = async (userId: string, apiKey: string): Promise<void> => {
    const { error } = await supabase
        .from('profiles')
        .update({
            gemini_api_key: apiKey,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    if (error) throw error;
};
