import i18n from "../config/i18n";

export const translate = (key: string, params: Record<string, string | number> = {}, lng = 'en'): string => {
    try {
        return i18n.t(key, { ...params, lng });
    } catch (err) {
        return '';
    }
};
