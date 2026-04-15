import { useIsMobile } from "@/hooks/use-mobile";
import { Smartphone, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export default function TaskHeader() {
    const isMobile = useIsMobile();
    const { t, i18n } = useTranslation()

    const handleChangeTranslation = () => {
        if( !i18n.isInitialized ) return
        const nextLang = {
            pt: 'es',
            es: 'en',
            en: 'pt'
        }[i18n.language]
        i18n.changeLanguage(nextLang)
    }

    return (<>
        <span className="flex flex-row items-center justify-between gap-2">
            <span className="flex flex-row items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t('head.title')}</h1>
                { isMobile ? <Smartphone className="mt-1"/> : <Monitor className="mt-1"/> }
            </span>
            <Button onClick={handleChangeTranslation} className="hover:bg-slate-300 hover:text-white bg-white text-slate-300 border-slate-300 border-2 block w-8 h-8 p-0 flex items-center justify-center uppercase">{ i18n.language }</Button>
        </span>
        <p className="text-sm text-muted-foreground mt-1 mb-6">{t('head.subtitle')}</p>
    </>)
}