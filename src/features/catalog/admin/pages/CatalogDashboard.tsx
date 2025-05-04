import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import ManufacturerCreateForm from "../forms/ManufacturerCreateForm";
import CarModelCreateForm from "../forms/CarModelCreateForm";
import GenerationCreateForm from "../forms/GenerationCreateForm";
import ModificationCreateForm from "../forms/ModificationCreateForm";

export default function CatalogDashboard() {
    type EntityType = "manufacturer" | "model" | "generation" | "modification";

    const [entityType, setEntityType] = useState<EntityType>("manufacturer");
    const [currentForm, setCurrentForm] = useState<React.ReactNode>(<ManufacturerCreateForm />)

    const handleEntityTypeChanged = (type: EntityType) => {
        setEntityType(type);

        switch (type) {
            case "manufacturer":
                setCurrentForm(<ManufacturerCreateForm />);
                break;
            case "model":
                setCurrentForm(<CarModelCreateForm/>);
                break;
            case "generation":
                setCurrentForm(<GenerationCreateForm/>);
                break;
            case "modification":
                setCurrentForm(<ModificationCreateForm/>);
                break;
        }
    }


    return (
        <div className="flex flex-col items-center  min-h-screen">
            <div className="w-full max-w-2xl">
                <Tabs
                    value={entityType}
                    onValueChange={(val) => handleEntityTypeChanged(val as EntityType)}
                >
                    <TabsList className="flex justify-center items-center w-full">
                        <TabsTrigger value="manufacturer">Manufacturer</TabsTrigger>
                        <TabsTrigger value="model">Model</TabsTrigger>
                        <TabsTrigger value="generation">Generation</TabsTrigger>
                        <TabsTrigger value="modification">Modification</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="mt-4 w-full flex justify-center">
                    {currentForm}
                </div>
            </div>
        </div>
    );
}