import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type CustomFormProps = {
    title: string;
    children: ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    error?: string;
    submitLabel?: string;
    successMessage?: string;
    errorMessage?: string;
};

export default function CustomForm({
    title,
    children,
    onSubmit,
    error,
    submitLabel = "Submit",
    successMessage = "Submitted successfully!",
    errorMessage = "An error occurred while submitting the form.",
}: CustomFormProps) {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await onSubmit(e);
            toast.success(successMessage);
        } catch (err) {
            toast.error(errorMessage);
            console.error(err);
        }
    };

    return (
        <Card className="w-96 shadow-lg">
            <CardHeader>
                <CardTitle className="text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {children}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full">
                        {submitLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
