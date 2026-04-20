import { useEffect, useState } from "react";

import type { StockPageConfigurationDto } from "../../dto/configuration.dto";
import { configurationService } from "../../services/configuration.sevice";
import StockDisplaySettingsForm from "../../components/stock/StockDisplaySettingsForm";


const defaultConfiguration: StockPageConfigurationDto = {
  showReferenceColumn: true,
  showLastModifiedColumn: true,
  showMinStockColumn: true,
};

export default function ConfigurationPage() {
  const [configuration, setConfiguration] =
    useState<StockPageConfigurationDto>(defaultConfiguration);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadConfiguration();
  }, []);

  async function loadConfiguration() {
    setLoading(true);
    try {
      const data = await configurationService.get();
      if (data) {
        setConfiguration(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const saved = await configurationService.save(configuration);
      setConfiguration(saved);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando configuración...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Configuración</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Controla qué columnas se muestran en la página de stock
      </p>

      <StockDisplaySettingsForm
        value={configuration}
        onChange={setConfiguration}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}