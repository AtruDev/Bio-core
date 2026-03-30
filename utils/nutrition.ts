export interface Biometria {
  peso: number;
  altura: number; // em metros
  idade: number;
  genero: string; // "Masculino" ou "Feminino"
  nivel_surf: string; 
  objetivo: string; 
}

export interface MacroResult {
  tmb: number;
  fator_atividade: number;
  gasto_total: number;
  meta_calorica: number;
  proteina_g: number;
  gordura_g: number;
  carboidrato_g: number;
}

export function calcularMifflinStJeor(bio: Biometria): MacroResult {
  // 1. Calcular TMB
  // Altura em cm para a fórmula
  const altura_cm = bio.altura * 100;
  
  let tmb = (10 * bio.peso) + (6.25 * altura_cm) - (5 * bio.idade);
  
  if (bio.genero === "Masculino") {
    tmb += 5;
  } else {
    tmb -= 161;
  }

  // 2. Fator de Atividade (Nível de Surf)
  let fator_atividade = 1.2; // Sedentário base fallback
  if (bio.nivel_surf.includes("Iniciante")) fator_atividade = 1.35;
  else if (bio.nivel_surf.includes("Intermediário")) fator_atividade = 1.55;
  else if (bio.nivel_surf.includes("Avançado")) fator_atividade = 1.725;
  else if (bio.nivel_surf.includes("Pró")) fator_atividade = 1.9;

  // 3. Gasto Energético Total (GET)
  const gasto_total = tmb * fator_atividade;

  // 4. Meta Calórica pelo Objetivo
  let meta_calorica = gasto_total;
  if (bio.objetivo.includes("Secar") || bio.objetivo.includes("Perda de Gordura")) {
    meta_calorica -= 400; // Déficit agressivo/moderado
  } else if (bio.objetivo.includes("Ganho de Massa")) {
    meta_calorica += 300; // Superávit leve para não pesar na prancha
  }
  
  // Arredonda para não ter quebrados
  meta_calorica = Math.round(meta_calorica);

  // 5. Divisão de Macros Científica Customizada (para surf)
  // Proteína: 2.2g/kg para reparo muscular e não catabolizar na remada
  const proteina_g = Math.round(bio.peso * 2.2);
  const proteina_kcal = proteina_g * 4;

  // Gordura: 1.0g/kg para metabolismo hormonal
  const gordura_g = Math.round(bio.peso * 1.0);
  const gordura_kcal = gordura_g * 9;

  // Carboidrato: Preenche o resto da meta (energia primária do surf)
  const restante_kcal = meta_calorica - proteina_kcal - gordura_kcal;
  const carboidrato_g = Math.round(Math.max(0, restante_kcal / 4));

  return {
    tmb: Math.round(tmb),
    fator_atividade,
    gasto_total: Math.round(gasto_total),
    meta_calorica,
    proteina_g,
    gordura_g,
    carboidrato_g
  }
}
