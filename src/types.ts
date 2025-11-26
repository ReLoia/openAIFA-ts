export interface AifaContainer {
    aic: string;
    dc: string;
    fc: string;
}

export interface AifaForm {
    ifd: number;
    d: string;
    c: AifaContainer[];
}

export interface AifaMedicine {
    cm: number;
    aic6: string;
    pa: string;
    df: string;
    rs: string;
    fd: AifaForm[];
}

export interface DatabaseVersion {
    version: string;
    date: string;
}

export interface AifaAuthResponse {
    access_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
}

export interface AifaDetailedMedicine {
    codiceMedicinale: number;
    aic6: string;
    denominazioneFarmaco: string;
    principiAttivi: string[];
    codiceSis: number;
    ragioneSociale: string;
    tipoFarmaco: string;
}

export interface AifaRefundClass {
    sigla: string;
    descrizione: string;
}

export interface AifaSupplyRegime {
    sigla: string;
    descrizione: string;
}

export interface AifaDispensation {
    classeRimborsabilita: AifaRefundClass;
    regimiFornitura: AifaSupplyRegime[];
    prezzo: number | null;
}

export interface AifaDurations {
    dopoApertura: string;
    dopoRicostituzione: string;
    integro: string;
}

export interface AifaStorageConditions {
    integro: string;
    dopoRicostituzione: string;
}

export interface AifaPdfLinks {
    fi: string;
    rcp: string;
}

export interface AifaAtc {
    sigla: string;
    descrizione: string;
}

export interface AifaContainerInfo {
    aic9: string;
    denominazione: string;
    medicinale: AifaDetailedMedicine;
    formaFarmaceutica: string;
    vieDiSomministrazione: string[];
    dispensazione: AifaDispensation;
    durate: AifaDurations;
    condizioniDiConservazione: AifaStorageConditions;
    innovativo: boolean;
    orfano: boolean;
    flagDopante: boolean;
    livelloGuida: number;
    flagRicetta: boolean;
    linkPDF: AifaPdfLinks;
    statoCommercializzazione: string;
    flagPotassio: boolean;
    atc: AifaAtc[];
    dataAutorizzazione: string;
    dataInizioCarenza: string | null;
    motivoCarenza: string | null;
    dataFinePresuntaCarenza: string | null;
    indicazioni: string | null;
    equivalente: string | null;
    notaAifa: string | null;
}

export interface AifaContainerInfoResponse {
    dettaglioConfezione: AifaContainerInfo;
    status: string;
}