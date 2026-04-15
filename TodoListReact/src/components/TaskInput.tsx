import { useState } from "react";
import { Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TaskInput({ onAddTask }: { onAddTask: (task: string) => void }) {
    const { t } = useTranslation()
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(null)

    const handleAddTask = () => {
        if (input.trim().length === 0) return;
        if( onAddTask ) onAddTask(input.trim());
        setInput("");
    }

    const handleKeyDown =  (e) => {
        if( e.key === "Enter" ) handleAddTask()
        else {
            clearTimeout( typing )
            const id = setTimeout(() => {
                setTyping( null )
            }, 500)
            setTyping( id )
        }
    }

    return (
        <div className="flex gap-2 mb-8 outline outline-muted rounded-lg overflow-hidden">
            <Input
                placeholder={t('form.placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10 !outline-none !ring-0 !ring-none !ring-offset-0 !border-none"
            />
            <Button
                onClick={handleAddTask}
                disabled={input.trim().length==0}
                size="icon"
                className="h-10 w-10 shrink-0 !ring-0 disabled:opacity-50 opacity-100"
            >
                { typing ? <Pen className="h-1 w-1 animate-bounce" /> :  <Plus className="h-4 w-4" /> }
            </Button>
        </div>
    )

}