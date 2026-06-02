import { useState } from "react";

const steps = [
  {
    id: 1,
    emoji: "🌐",
    title: "Coleta de Dados",
    subtitle: "Reunir o material bruto",
    color: "#00d4ff",
    analogy: "Contratar um funcionário e dar pra ele uma biblioteca inteira para estudar.",
    what: "A IA precisa aprender com exemplos reais do mundo. Antes de qualquer coisa, você precisa reunir uma quantidade enorme de dados — quanto mais, melhor.",
    sources: ["Bancos de dados SQL/NoSQL", "APIs externas (Twitter, Reddit, Wikipedia)", "Documentos PDF, Word, HTML", "Imagens e vídeos", "Sensores IoT", "Web scraping"],
    deepDive: {
      title: "Por que dados são tudo?",
      content: `A qualidade do modelo depende 100% da qualidade dos dados. 

"Garbage in, garbage out" — se você alimentar a IA com dados ruins, ela aprende padrões ruins.

Um LLM como o GPT-4 foi treinado com trilhões de palavras: livros inteiros, a Wikipedia completa, código do GitHub, artigos científicos, páginas web.

Escala real:
• GPT-3: ~300 bilhões de tokens
• LLaMA 2: ~2 trilhões de tokens  
• 1 token ≈ 0.75 palavras em inglês`,
      code: `# Exemplo: coletando dados de uma API
import requests

def coletar_tweets(query, limite=1000):
    url = "https://api.twitter.com/2/tweets/search"
    headers = {"Authorization": f"Bearer {TOKEN}"}
    params = {"query": query, "max_results": 100}
    
    tweets = []
    while len(tweets) < limite:
        resp = requests.get(url, headers=headers, params=params)
        tweets.extend(resp.json()["data"])
    
    return tweets

dados = coletar_tweets("machine learning", limite=5000)
print(f"Coletados: {len(dados)} tweets")`
    }
  },
  {
    id: 2,
    emoji: "🧹",
    title: "Preparação dos Dados",
    subtitle: "Limpar e organizar",
    color: "#ff6b35",
    analogy: "Jogar fora os livros rasgados, corrigir os erros e organizar tudo na ordem certa.",
    what: "Dados brutos são sujos. Têm duplicatas, erros, formatos inconsistentes, valores faltando. Essa etapa consome até 80% do tempo de um projeto real de ML.",
    sources: ["Remoção de duplicatas", "Correção de valores errados", "Preenchimento de dados faltantes", "Normalização de formatos", "Remoção de ruído", "Rotulagem manual"],
    deepDive: {
      title: "Rotulagem — o trabalho invisível",
      content: `Rotulagem (labeling) é quando humanos marcam manualmente os dados para ensinar a IA.

Exemplos:
• "Este email é SPAM ou NÃO SPAM?" → classificação
• "Desenhe um retângulo ao redor do carro nessa foto" → object detection
• "Essa resposta da IA foi útil? 1-5 estrelas" → RLHF

Empresas como Scale AI e Appen existem só para fazer esse trabalho humano de rotulagem. É caro, lento e essencial.

Problemas comuns:
• Dados desbalanceados (1000 gatos, 10 cachorros)
• Viés nos dados (fotos de médicos só com homens brancos)
• Dados faltando (NaN, null, strings vazias)`,
      code: `import pandas as pd
import numpy as np

df = pd.read_csv("dados_brutos.csv")

# Ver problemas
print(df.isnull().sum())  # valores faltando
print(df.duplicated().sum())  # duplicatas

# Limpar
df = df.drop_duplicates()
df = df.dropna(subset=["coluna_essencial"])

# Preencher valores faltando com a média
df["idade"].fillna(df["idade"].mean(), inplace=True)

# Normalizar texto
df["texto"] = df["texto"].str.lower().str.strip()

print(f"Dados limpos: {len(df)} linhas")`
    }
  },
  {
    id: 3,
    emoji: "✂️",
    title: "Divisão dos Dados",
    subtitle: "Separar em 3 pilhas",
    color: "#a855f7",
    analogy: "Separar os livros de estudo, os exercícios e a prova surpresa — antes de começar.",
    what: "Nunca treine com todos os dados. Separe em 3 conjuntos distintos para medir honestamente o desempenho do modelo.",
    sources: ["Training Set (70%): onde o modelo aprende", "Validation Set (15%): ajuste durante o treino", "Test Set (15%): prova final, nunca vista antes"],
    deepDive: {
      title: "Por que separar? O problema do Overfitting",
      content: `Overfitting = o modelo decorou os dados em vez de aprender padrões.

Analogia: um aluno que decora as respostas do livro mas não sabe resolver questões novas.

Como detectar:
• Acurácia alta no treino (98%)
• Acurácia baixa no teste (60%)
→ O modelo decorou, não aprendeu

O Test Set é sagrado:
Você jamais pode deixar o modelo "ver" o Test Set antes da hora. Se você usa o Test Set para tomar decisões durante o desenvolvimento, ele deixa de ser uma medida honesta.

Cross-validation:
Para datasets pequenos, divide em K partes e rotaciona qual parte é o "test" — assim usa todos os dados para treinar e testar.`,
      code: `from sklearn.model_selection import train_test_split

X = features  # variáveis de entrada
y = labels    # variável alvo

# Divisão 70/15/15
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.30, random_state=42
)

X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, random_state=42
)

print(f"Treino:    {len(X_train)} amostras")
print(f"Validação: {len(X_val)} amostras")
print(f"Teste:     {len(X_test)} amostras")`
    }
  },
  {
    id: 4,
    emoji: "⚙️",
    title: "Engenharia de Features",
    subtitle: "Escolher o que importa",
    color: "#22c55e",
    analogy: "O professor sublinha o que vai cair na prova — você não estuda tudo com a mesma atenção.",
    what: "Features são as variáveis de entrada do modelo. Nem toda informação é útil. Escolher e criar as features certas pode ser mais impactante que escolher o algoritmo.",
    sources: ["Seleção de variáveis relevantes", "Criação de novas features", "Encoding de variáveis categóricas", "Redução de dimensionalidade (PCA)", "Feature scaling", "Feature importance"],
    deepDive: {
      title: "Exemplos reais de Feature Engineering",
      content: `Exemplo 1: Prever preço de imóvel
• Útil: m², bairro, nº quartos, idade do imóvel
• Inútil: cor da porta, nome do dono anterior

Mas você pode CRIAR features novas:
• "preço por m²" de imóveis vizinhos
• "distância até o metrô mais próximo"
• "crime rate do bairro"

Exemplo 2: Detecção de fraude bancária
• Feature criada: "velocidade de transações" 
  (5 compras em 2 minutos = suspeito)
• Feature criada: "distância geográfica entre transações"

Para texto (NLP):
• TF-IDF: peso de cada palavra no documento
• Word embeddings: representar palavras como vetores
• Tokenização: quebrar texto em pedaços menores`,
      code: `import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

df = pd.read_csv("imoveis.csv")

# Criar nova feature
df["preco_por_m2_vizinhanca"] = (
    df.groupby("bairro")["preco"].transform("median") / 
    df["m2"]
)

# Converter categoria em número
le = LabelEncoder()
df["bairro_encoded"] = le.fit_transform(df["bairro"])

# Normalizar (mesma escala)
scaler = StandardScaler()
df[["m2", "idade"]] = scaler.fit_transform(df[["m2", "idade"]])

# Ver importância das features (após treinar)
# feature_importances_ no Random Forest mostra isso`
    }
  },
  {
    id: 5,
    emoji: "🧠",
    title: "Treinamento do Modelo",
    subtitle: "O algoritmo aprende",
    color: "#f59e0b",
    analogy: "O funcionário lê tudo, erra, recebe correção, tenta de novo. Milhões de vezes. Cada ciclo ele fica um pouco melhor.",
    what: "O modelo ajusta seus parâmetros internos para minimizar o erro nas previsões. É um processo matemático de otimização que pode levar de segundos a meses, dependendo da escala.",
    sources: ["Redes Neurais (Deep Learning)", "Random Forest", "XGBoost / Gradient Boosting", "Transformers (LLMs)", "SVM, Regressão Logística", "K-Means (não supervisionado)"],
    deepDive: {
      title: "Como uma Rede Neural aprende (simplificado)",
      content: `Passo a passo de uma época de treino:

1. FORWARD PASS
   Dados de entrada passam pela rede → geram uma previsão

2. CÁLCULO DO ERRO (Loss Function)
   Compara previsão com resposta correta
   Ex: previu 80, correto era 95 → erro = 15

3. BACKPROPAGATION
   O erro "volta" pela rede, camada por camada
   Cada neurônio recebe sua parcela de culpa

4. GRADIENT DESCENT
   Os pesos (parâmetros) são ajustados para reduzir o erro
   Learning rate define o tamanho do ajuste

5. Repete isso para cada batch de dados = 1 step
   Passa por todo o dataset = 1 época
   Treina por N épocas até convergir

Para LLMs:
• GPT-3: 175 bilhões de parâmetros
• Treinamento: semanas em milhares de GPUs A100
• Custo estimado: ~$4-12 milhões`,
      code: `import torch
import torch.nn as nn

class RedeNeural(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(10, 64),   # entrada: 10 features
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)     # saída: 1 valor
        )
    
    def forward(self, x):
        return self.layers(x)

modelo = RedeNeural()
optimizer = torch.optim.Adam(modelo.parameters(), lr=0.001)
loss_fn = nn.MSELoss()

# Loop de treinamento
for epoca in range(100):
    previsao = modelo(X_train)
    loss = loss_fn(previsao, y_train)
    
    optimizer.zero_grad()
    loss.backward()      # backpropagation
    optimizer.step()     # atualiza pesos
    
    print(f"Época {epoca}: Loss = {loss.item():.4f}")`
    }
  },
  {
    id: 6,
    emoji: "📊",
    title: "Validação e Ajuste",
    subtitle: "Medir e melhorar",
    color: "#ec4899",
    analogy: "O aluno faz os exercícios do meio do livro. Você analisa onde ele erra e muda a estratégia de ensino.",
    what: "Usar o Validation Set para medir o desempenho e ajustar hiperparâmetros — as configurações do treino que você define antes de começar.",
    sources: ["Acurácia (Accuracy)", "Precisão (Precision)", "Recall (Sensibilidade)", "F1-Score (equilíbrio)", "AUC-ROC", "RMSE / MAE (regressão)"],
    deepDive: {
      title: "Métricas explicadas com exemplo real",
      content: `Cenário: IA detectando câncer em exames

De 100 exames: 10 têm câncer, 90 são saudáveis.
A IA disse que 15 têm câncer.

Verdadeiros Positivos (VP): 8  → detectou câncer onde tinha
Falsos Positivos (FP): 7       → disse câncer onde não tinha
Falsos Negativos (FN): 2       → perdeu 2 casos reais
Verdadeiros Negativos (VN): 83 → corretamente saudável

ACURÁCIA = (VP + VN) / total = (8+83)/100 = 91%
→ "91% das previsões foram corretas"
→ Parece ótimo, mas...

PRECISÃO = VP / (VP + FP) = 8/15 = 53%
→ "Quando disse câncer, acertou 53%"
→ Muitos alarmes falsos → pacientes ansiosos desnecessariamente

RECALL = VP / (VP + FN) = 8/10 = 80%
→ "De todos os cânceres, encontrou 80%"
→ Perdeu 2 casos reais → grave!

F1-SCORE = média harmônica entre precisão e recall = 63%

Em medicina: RECALL é mais importante (não perder casos reais)
Em spam: PRECISÃO é mais importante (não bloquear email legítimo)`,
      code: `from sklearn.metrics import (
    accuracy_score, precision_score, 
    recall_score, f1_score, confusion_matrix
)

y_pred = modelo.predict(X_val)

print(f"Acurácia:  {accuracy_score(y_val, y_pred):.2%}")
print(f"Precisão:  {precision_score(y_val, y_pred):.2%}")
print(f"Recall:    {recall_score(y_val, y_pred):.2%}")
print(f"F1-Score:  {f1_score(y_val, y_pred):.2%}")

# Matriz de confusão
cm = confusion_matrix(y_val, y_pred)
print("\\nMatriz de Confusão:")
print(f"VP: {cm[1,1]}  FP: {cm[0,1]}")
print(f"FN: {cm[1,0]}  VN: {cm[0,0]}")

# Ajuste de hiperparâmetros (Grid Search)
from sklearn.model_selection import GridSearchCV
params = {"n_estimators": [100,200], "max_depth": [3,5,10]}
grid = GridSearchCV(modelo, params, cv=5, scoring="f1")
grid.fit(X_train, y_train)
print(f"Melhores params: {grid.best_params_}")`
    }
  },
  {
    id: 7,
    emoji: "🎯",
    title: "Teste Final",
    subtitle: "A prova surpresa",
    color: "#06b6d4",
    analogy: "A prova que o aluno nunca viu. Só aqui você sabe se ele realmente aprendeu ou apenas decorou.",
    what: "Usar o Test Set — dados que o modelo NUNCA viu — para medir o desempenho real. Esse número é o que você reporta para o mundo.",
    sources: ["Avaliação no Test Set isolado", "Detecção de overfitting", "Comparação com baseline", "Análise de erros (error analysis)", "Validação com especialistas do domínio"],
    deepDive: {
      title: "O que fazer quando o resultado é ruim?",
      content: `Diagnóstico por sintoma:

UNDERFITTING (modelo simples demais)
Sintoma: erro alto no treino E no teste
Causa: modelo não tem capacidade suficiente
Solução: modelo mais complexo, mais features, mais dados

OVERFITTING (modelo complexo demais)  
Sintoma: erro baixo no treino, alto no teste
Causa: modelo memorizou os dados
Solução: 
• Regularização (L1/L2/Dropout)
• Mais dados de treino
• Modelo mais simples
• Data augmentation

BOAS PERFORMANCES — o que é suficiente?
Depende totalmente do problema:
• Diagnóstico médico: >95% recall é o mínimo
• Recomendação de filme: 70% já é ótimo
• Previsão do tempo: RMSE < X graus

Baseline simples:
Sempre compare com uma "IA burra":
• "Sempre responde a classe mais comum"
• Se baseline = 90% e seu modelo = 91% → você não está adicionando valor`,
      code: `# Avaliação final — só uma vez!
from sklearn.metrics import classification_report

y_pred_final = modelo.predict(X_test)

print("=== RESULTADO FINAL ===")
print(classification_report(y_test, y_pred_final))

# Comparar com baseline "burro"
import numpy as np
baseline = np.ones(len(y_test)) * y_train.mean().round()
print(f"Baseline acurácia: {accuracy_score(y_test, baseline):.2%}")
print(f"Modelo acurácia:   {accuracy_score(y_test, y_pred_final):.2%}")

# Análise de erros — ver onde o modelo falha
erros = X_test[y_pred_final != y_test]
print(f"\\n{len(erros)} erros para analisar")`
    }
  },
  {
    id: 8,
    emoji: "🚀",
    title: "Deploy",
    subtitle: "Lançar no mundo real",
    color: "#84cc16",
    analogy: "Contratar o funcionário de verdade e deixar ele atender clientes reais — não mais simulações.",
    what: "Colocar o modelo em produção para ser usado por pessoas reais. O deploy vai muito além de 'subir o código' — envolve escalabilidade, latência, versionamento e segurança.",
    sources: ["API REST (FastAPI, Flask)", "Containers Docker + Kubernetes", "Serverless (AWS Lambda)", "Edge deployment (celular, IoT)", "Model serving (TorchServe, TF Serving)", "A/B testing de modelos"],
    deepDive: {
      title: "Deploy moderno de ML — como funciona de verdade",
      content: `Arquitetura típica de um modelo em produção:

[App do usuário] 
    → [API Gateway] 
        → [Model Server] 
            → [Modelo carregado em memória]
            → [Feature Store] (features pré-calculadas)
            → [Cache] (resultados frequentes)
        → [Logging] (guardar inputs/outputs)
        → [Monitoring] (alertas de degradação)

Desafios reais:
LATÊNCIA: o usuário não pode esperar 5 segundos
→ Quantização do modelo (float32 → int8)
→ Batching de requisições
→ Cache de resultados comuns

ESCALA: e se 1 milhão de usuários acessarem ao mesmo tempo?
→ Horizontal scaling (mais instâncias)
→ Load balancer
→ Auto-scaling por demanda

VERSIONAMENTO: como lançar um novo modelo sem derrubar tudo?
→ Blue/Green deployment
→ Canary release (5% do tráfego primeiro)
→ Feature flags

Para LLMs especificamente:
→ vLLM para serving eficiente
→ Quantização GGUF (rodar no seu computador)
→ Streaming de tokens (você vê o texto aparecer progressivamente)`,
      code: `# Deploy simples com FastAPI
from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()
modelo = joblib.load("modelo_treinado.pkl")
scaler = joblib.load("scaler.pkl")

@app.post("/predict")
async def prever(dados: dict):
    # Pegar features da requisição
    features = np.array([[
        dados["m2"],
        dados["quartos"], 
        dados["bairro_encoded"]
    ]])
    
    # Normalizar igual ao treino
    features_scaled = scaler.transform(features)
    
    # Prever
    preco = modelo.predict(features_scaled)[0]
    
    return {
        "preco_estimado": f"R$ {preco:,.0f}",
        "modelo_versao": "v2.1.0"
    }

# Rodar: uvicorn app:app --host 0.0.0.0 --port 8000
# Chamar: POST /predict {"m2": 80, "quartos": 2, ...}`
    }
  },
  {
    id: 9,
    emoji: "📡",
    title: "Monitoramento",
    subtitle: "Cuidar do modelo vivo",
    color: "#f43f5e",
    analogy: "O funcionário está trabalhando. Mas o mundo muda. Você precisa acompanhar se ele ainda está performando bem.",
    what: "Modelos degradam com o tempo. O mundo muda, os dados mudam, o comportamento dos usuários muda. Monitoramento contínuo é o que mantém o modelo útil.",
    sources: ["Data drift (distribuição dos dados mudou)", "Concept drift (relação entre features e alvo mudou)", "Performance monitoring", "Alertas automáticos", "Logs de inferência", "Retreinamento automático"],
    deepDive: {
      title: "Por que modelos degradam? Data Drift explicado",
      content: `Data Drift = os dados reais começam a parecer diferentes dos dados de treino.

Exemplo 1: Modelo de preço de imóveis
• Treinado em 2020 (pré-pandemia)
• 2021: trabalho remoto → demanda por casas com home office explodiu
• Modelo continua prevendo preços de 2020 → inútil

Exemplo 2: Detecção de spam
• Spammers mudam de tática toda semana
• Modelo treinado no passado não reconhece novos padrões
• Precisa retreinar constantemente

Concept Drift (mais sutil):
Não são os dados que mudaram, é a relação entre eles e o que você quer prever.
• "Crédito de risco" → comportamento financeiro pós-COVID ≠ pré-COVID

Tipos de monitoramento:
• PSI (Population Stability Index) → mede mudança na distribuição
• KL Divergence → distância entre distribuições
• Alertas por performance (quando F1 cai abaixo de X%)

Retreinamento:
• Agendado (toda semana/mês)
• Triggered (quando performance cai)
• Contínuo (online learning — aprende com cada nova amostra)`,
      code: `# Monitoramento com Evidently (biblioteca Python)
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

# Comparar dados de treino com dados de produção
report = Report(metrics=[DataDriftPreset()])
report.run(
    reference_data=df_treino,   # dados originais
    current_data=df_producao    # dados chegando agora
)

# Ver relatório
report.show()

# Alertas automáticos
def verificar_performance(modelo, X_novo, y_novo):
    y_pred = modelo.predict(X_novo)
    f1 = f1_score(y_novo, y_pred)
    
    if f1 < 0.80:  # abaixo do threshold
        enviar_alerta(f"⚠️ Performance caiu para {f1:.2%}")
        acionar_retreinamento()
    
    return f1

# Agendar verificação diária
# schedule.every().day.at("09:00").do(verificar_performance, ...)`
    }
  },
];

const llmSteps = [
  { label: "Coleta", detail: "Web, livros, código — trilhões de tokens", color: "#00d4ff" },
  { label: "Limpeza", detail: "Dedup, filtragem de qualidade, filtros de segurança", color: "#ff6b35" },
  { label: "Tokenização", detail: "Texto → números que o modelo entende", color: "#a855f7" },
  { label: "Pré-treino", detail: "Prever o próximo token — bilhões de exemplos", color: "#f59e0b" },
  { label: "Fine-tuning", detail: "Especializar para instrução/conversa", color: "#22c55e" },
  { label: "RLHF", detail: "Humanos avaliam respostas → modelo aprende a preferências", color: "#ec4899" },
  { label: "Avaliação", detail: "Benchmarks: MMLU, HumanEval, MT-Bench...", color: "#06b6d4" },
  { label: "Deploy", detail: "API escalável com streaming de tokens", color: "#84cc16" },
  { label: "Monitoramento", detail: "Safety, qualidade, drift contínuos", color: "#f43f5e" },
];

export default function AIPipelineGuide() {
  const [activeStep, setActiveStep] = useState(null);
  const [activeTab, setActiveTab] = useState("conceito");

  const step = steps.find(s => s.id === activeStep);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      color: "#e2e8f0",
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e293b",
        padding: "32px 40px 24px",
        background: "linear-gradient(180deg, #0d1117 0%, #080c14 100%)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
            GUIA COMPLETO
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 700,
            margin: 0,
            background: "linear-gradient(90deg, #e2e8f0 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}>
            Pipeline de Treinamento de IA
          </h1>
          <p style={{ color: "#64748b", marginTop: 8, fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
            Clique em cada etapa para entender a fundo — com analogias, exemplos reais e código.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* Pipeline Steps Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}>
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(activeStep === s.id ? null : s.id)}
              style={{
                background: activeStep === s.id
                  ? `linear-gradient(135deg, ${s.color}15, ${s.color}08)`
                  : "#0d1117",
                border: activeStep === s.id
                  ? `1px solid ${s.color}60`
                  : "1px solid #1e293b",
                borderRadius: 10,
                padding: "16px 18px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                color: "inherit",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                if (activeStep !== s.id) {
                  e.currentTarget.style.borderColor = s.color + "40";
                  e.currentTarget.style.background = s.color + "08";
                }
              }}
              onMouseLeave={e => {
                if (activeStep !== s.id) {
                  e.currentTarget.style.borderColor = "#1e293b";
                  e.currentTarget.style.background = "#0d1117";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{
                  fontSize: 11,
                  color: s.color,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  opacity: 0.7,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: activeStep === s.id ? s.color : "#cbd5e1",
                marginBottom: 3,
                fontFamily: "system-ui, sans-serif",
              }}>
                {s.title}
              </div>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "system-ui, sans-serif" }}>
                {s.subtitle}
              </div>
              {activeStep === s.id && (
                <div style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: s.color,
                  boxShadow: `0 0 8px ${s.color}`,
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        {step && (
          <div style={{
            background: "#0d1117",
            border: `1px solid ${step.color}30`,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 32,
            animation: "fadeIn 0.2s ease",
          }}>
            {/* Panel Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #1e293b",
              background: `linear-gradient(135deg, ${step.color}10, transparent)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{step.emoji}</span>
                  <h2 style={{
                    margin: 0,
                    fontSize: 18,
                    color: step.color,
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {step.title}
                  </h2>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#94a3b8",
                  fontFamily: "system-ui, sans-serif",
                  fontStyle: "italic",
                }}>
                  💡 {step.analogy}
                </p>
              </div>
              <button
                onClick={() => setActiveStep(null)}
                style={{
                  background: "none",
                  border: "1px solid #334155",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontFamily: "inherit",
                }}
              >
                fechar
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid #1e293b",
              padding: "0 24px",
            }}>
              {["conceito", "detalhes", "código"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab ? `2px solid ${step.color}` : "2px solid transparent",
                    color: activeTab === tab ? step.color : "#475569",
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: "24px" }}>
              {activeTab === "conceito" && (
                <div>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#cbd5e1",
                    marginBottom: 20,
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {step.what}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                    {step.sources.map((src, i) => (
                      <div key={i} style={{
                        padding: "8px 12px",
                        background: "#0a0f1a",
                        border: "1px solid #1e293b",
                        borderRadius: 6,
                        fontSize: 12,
                        color: "#64748b",
                        fontFamily: "system-ui, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}>
                        <span style={{ color: step.color, fontSize: 10 }}>▸</span>
                        {src}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "detalhes" && (
                <div>
                  <h3 style={{
                    fontSize: 13,
                    color: step.color,
                    marginBottom: 16,
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}>
                    {step.deepDive.title}
                  </h3>
                  <pre style={{
                    fontSize: 12,
                    lineHeight: 1.8,
                    color: "#94a3b8",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    fontFamily: "inherit",
                  }}>
                    {step.deepDive.content}
                  </pre>
                </div>
              )}

              {activeTab === "código" && (
                <div>
                  <div style={{
                    background: "#030508",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "8px 16px",
                      borderBottom: "1px solid #1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
                      <span style={{ fontSize: 10, color: "#334155", marginLeft: 8 }}>python</span>
                    </div>
                    <pre style={{
                      padding: "20px",
                      margin: 0,
                      fontSize: 11,
                      lineHeight: 1.7,
                      color: "#7dd3fc",
                      overflowX: "auto",
                      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
                    }}>
                      <code>{step.deepDive.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LLM Section */}
        <div style={{
          background: "#0d1117",
          border: "1px solid #1e293b",
          borderRadius: 14,
          padding: "24px",
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
              CASO ESPECIAL
            </div>
            <h2 style={{
              margin: 0,
              fontSize: 16,
              color: "#e2e8f0",
              fontFamily: "system-ui, sans-serif",
            }}>
              Pipeline de LLMs — ChatGPT, Claude, Gemini
            </h2>
            <p style={{ color: "#475569", fontSize: 12, marginTop: 6, fontFamily: "system-ui, sans-serif" }}>
              O pipeline geral + 3 etapas exclusivas de modelos de linguagem
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {llmSteps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{
                  padding: "6px 12px",
                  background: s.color + "15",
                  border: `1px solid ${s.color}40`,
                  borderRadius: 20,
                  fontSize: 11,
                  color: s.color,
                  fontFamily: "system-ui, sans-serif",
                  whiteSpace: "nowrap",
                }}>
                  {s.label}
                </div>
                {i < llmSteps.length - 1 && (
                  <span style={{ color: "#334155", fontSize: 10 }}>→</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {[
              {
                emoji: "🔤",
                title: "Tokenização",
                color: "#a855f7",
                content: `Texto não pode entrar direto na rede neural — ela só entende números.\n\n"Olá mundo" → [15339, 8278]\n\nCada token é um pedaço de palavra. O modelo aprende a prever qual token vem depois — isso é o pré-treino.\n\nO vocabulário do GPT-4 tem ~100.000 tokens.`
              },
              {
                emoji: "🎯",
                title: "Fine-tuning (SFT)",
                color: "#22c55e",
                content: `Depois do pré-treino (aprender linguagem em geral), você especializa o modelo.\n\nSupervised Fine-Tuning (SFT):\nDados de alta qualidade no formato:\n→ "Pergunta: X, Resposta ideal: Y"\n\nO modelo aprende a seguir instruções e conversar — não apenas completar texto.`
              },
              {
                emoji: "👥",
                title: "RLHF",
                color: "#ec4899",
                content: `Reinforcement Learning from Human Feedback.\n\n1. Modelo gera 2-4 respostas diferentes\n2. Humanos rankeiam: "A > C > B > D"\n3. Um Reward Model aprende essas preferências\n4. O LLM é ajustado via PPO para maximizar reward\n\nÉ como dar estrelas no Uber — o modelo aprende o que humanos valorizam: honestidade, utilidade, segurança.`
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#070b11",
                border: `1px solid ${item.color}25`,
                borderRadius: 10,
                padding: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: item.color,
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {item.title}
                  </span>
                </div>
                <pre style={{
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: "#64748b",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  fontFamily: "system-ui, sans-serif",
                }}>
                  {item.content}
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 24,
          padding: "16px 20px",
          background: "#0d1117",
          border: "1px solid #1e293b",
          borderRadius: 10,
          fontSize: 12,
          color: "#475569",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}>
          Clique em qualquer etapa acima → explore as abas <strong style={{ color: "#64748b" }}>conceito</strong>, <strong style={{ color: "#64748b" }}>detalhes</strong> e <strong style={{ color: "#64748b" }}>código</strong>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
    </div>
  );
}
