const hpcSteps = [
  {
    id: 'frameworks',
    emoji: "🏗️",
    title: "Frameworks de Escala",
    subtitle: "DeepSpeed & Megatron",
    color: "#3b82f6",
    analogy: "É como usar guindastes e máquinas pesadas para construir um arranha-céu, em vez de apenas ferramentas manuais.",
    what: "Para treinar modelos com bilhões de parâmetros, usamos frameworks que otimizam o uso da VRAM e a comunicação entre GPUs.",
    details: [
      "DeepSpeed (Microsoft): Famoso pelo ZeRO (Zero Redundancy Optimizer), que elimina redundâncias de memória dividindo estados do otimizador entre GPUs.",
      "Megatron-LM (NVIDIA): Especialista em dividir o próprio modelo (Tensor Parallelism) para que caiba no chip.",
      "DeepSeek-V3/R1: Utiliza arquiteturas que misturam esses frameworks com técnicas customizadas de Multi-head Latent Attention (MLA)."
    ],
    deepDive: {
      title: "O Segredo do ZeRO (Zero Redundancy Optimizer)",
      content: "O ZeRO divide a memória em 3 estágios:\n1. ZeRO-1: Divide os estados do otimizador.\n2. ZeRO-2: Divide também os gradientes.\n3. ZeRO-3: Divide os pesos (parâmetros) do modelo.\n\nIsso permite treinar modelos gigantes que seriam impossíveis em uma única GPU.",
      code: "# Exemplo de configuração DeepSpeed (JSON)\n{\n  \"zero_optimization\": {\n    \"stage\": 3,\n    \"offload_optimizer\": {\n      \"device\": \"cpu\"\n    }\n  },\n  \"fp16\": {\n    \"enabled\": true\n  }\n}"
    }
  },
  {
    id: 'training_types',
    emoji: "🧠",
    title: "Ciclo de Vida da IA",
    subtitle: "Pré-treino ao GRPO",
    color: "#8b5cf6",
    analogy: "A jornada de um estudante: Ler tudo (Pré-treino), Ter um tutor (SFT) e Aprender a raciocinar sozinho (GRPO).",
    what: "O treinamento não é um passo único, mas uma evolução de comportamento do modelo.",
    details: [
      "Pré-treinamento: O modelo 'lê' a internet. Custo altíssimo, focado em prever a próxima palavra.",
      "SFT (Supervised Fine-Tuning): Ajuste fino com exemplos ideais. 'Pergunta -> Resposta'.",
      "RLHF: Humanos dão notas para as respostas. O modelo aprende o que preferimos.",
      "GRPO (DeepSeek): Reinforcement Learning sem um modelo 'Reward' separado, focado em regras de raciocínio (como lógica e matemática)."
    ],
    deepDive: {
      title: "Inovação DeepSeek: GRPO",
      content: "Group Relative Policy Optimization (GRPO) permite que o modelo aprenda raciocínio lógico (como no DeepSeek-R1) comparando grupos de respostas entre si. Se uma resposta resolve o problema lógico e a outra não, o modelo se auto-corrige sem precisar de um avaliador humano caro em tempo real.",
      code: "# Pseudocódigo do GRPO\ndef calculate_grpo_loss(responses, target_logic):\n    # Agrupa respostas do modelo\n    group_rewards = [check_logic(r) for r in responses]\n    # Normaliza recompensas dentro do grupo\n    advantages = normalize(group_rewards)\n    return policy_loss(advantages)"
    }
  },
  {
    id: 'batching',
    emoji: "📦",
    title: "Logística de Dados",
    subtitle: "Micro, Local & Global Batches",
    color: "#10b981",
    analogy: "É como uma linha de montagem: Peças individuais (Micro), Bandejas (Local) e a Produção total da fábrica (Global).",
    what: "O 'Batch Size' define quantos dados o modelo vê antes de atualizar seu cérebro matemático.",
    details: [
      "Micro-batch: O menor pedaço que cabe na memória da GPU sem dar 'Out of Memory'.",
      "Local Batch: Soma dos micro-batches processados por uma única GPU.",
      "Global Batch: O total de dados processados por TODAS as GPUs do cluster antes de uma atualização global dos pesos."
    ],
    deepDive: {
      title: "Cálculo do Batch Global",
      content: "Global Batch Size = (Micro Batch Size) × (Gradient Accumulation Steps) × (Número de GPUs).\n\nSe o Global Batch é muito pequeno, o treino fica instável. Se é muito grande, o modelo pode parar de aprender detalhes finos.",
      code: "config = {\n  \"per_device_train_batch_size\": 4,\n  \"gradient_accumulation_steps\": 8,\n  \"num_gpus\": 128\n}\n\n# Global Batch = 4 * 8 * 128 = 4096"
    }
  },
  {
    id: 'parallelism',
    emoji: "⚡",
    title: "Estratégias Paralelas",
    subtitle: "Data, Tensor & Pipeline",
    color: "#f59e0b",
    analogy: "Dividir uma tarefa gigante: Copiar o manual (Data), Dividir uma conta matemática (Tensor) ou Linha de produção (Pipeline).",
    what: "Como o modelo é grande demais para uma GPU, dividimos o trabalho em fatias.",
    details: [
      "Data Parallelism (DP): Copia o modelo em todas as GPUs. Cada uma processa dados diferentes.",
      "Tensor Parallelism (TP): Divide camadas matemáticas (matrizes) individuais. Requer NVLink ultra-rápido.",
      "Pipeline Parallelism (PP): Divide as camadas do modelo sequencialmente (GPU 1 tem camadas 1-10, GPU 2 tem 11-20)."
    ],
    deepDive: {
      title: "Quando usar cada um?",
      content: "DP é o padrão para escalar dados. TP é obrigatório quando uma única camada não cabe na VRAM (modelos > 70B). PP é usado para conectar múltiplos nós de computação (servidores diferentes) onde a latência é maior.",
      code: "# Exemplo Megatron-LM\n# --tensor-model-parallel-size 8\n# --pipeline-model-parallel-size 4\n# Isso divide o modelo em 32 partes (8x4)"
    }
  },
  {
    id: 'hardware',
    emoji: "🔌",
    title: "Infraestrutura Física",
    subtitle: "H100, B200 & Conectividade",
    color: "#ef4444",
    analogy: "Não adianta ter um motor de Ferrari (GPU) se a estrada for de terra (PCIe). Você precisa de autoestradas (NVLink).",
    what: "O hardware define o limite físico da inteligência que podemos criar.",
    details: [
      "NVIDIA H100/H200: Arquitetura Hopper. Padrão ouro atual com memória HBM3.",
      "NVIDIA B200 (Blackwell): 5x mais performance em inferência, focada em trilhões de parâmetros.",
      "NVLink/NVSwitch: Conexão direta entre GPUs (até 900GB/s). Essencial para Tensor Parallelism.",
      "PCIe Gen5: Conexão padrão de placas-mãe. Muito lenta para comunicação intensa entre GPUs em IA."
    ],
    deepDive: {
      title: "NVLink vs PCIe",
      content: "Em treinamento distribuído, as GPUs precisam trocar gradientes constantemente. O PCIe funciona como uma rua de mão única com semáforos, enquanto o NVLink é uma rodovia de 10 faixas sem limites de velocidade. Sem NVLink, o Tensor Parallelism morre por gargalo de comunicação.",
      code: "# Verificando topologia no Linux\nnvidia-smi topo -m\n\n# Saída esperada para NVLink:\n# GPU0  GPU1  ...\n# GPU0  X     NV12\n# NV12 = Conectado via 12 caminhos NVLink"
    }
  }
];

function HPCGuide() {
  const [activeStepId, setActiveStepId] = React.useState(null);
  const [tab, setTab] = React.useState("conceito");
  const step = hpcSteps.find(s => s.id === activeStepId);

  return (
    <div style={{animation: "fadeIn 0.3s ease"}}>
      <div style={{marginBottom: 30, textAlign: "center"}}>
        <h2 style={{fontSize: 24, fontWeight: 700, color: "#e2e8f0", marginBottom: 10}}>
          Guia Especialista HPC & AI
        </h2>
        <p style={{color: "#94a3b8", fontSize: 14, maxWidth: 600, margin: "0 auto"}}>
          Aprenda como grandes laboratórios (DeepSeek, Anthropic, OpenAI) escalam o treinamento para milhares de GPUs.
        </p>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 30}}>
        {hpcSteps.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActiveStepId(s.id); setTab("conceito"); }}
            style={{
              background: activeStepId === s.id ? `${s.color}20` : "#0d1117",
              border: activeStepId === s.id ? `1px solid ${s.color}` : "1px solid #1e293b",
              borderRadius: 12, padding: "16px", cursor: "pointer", textAlign: "left",
              transition: "all 0.2s", color: "inherit"
            }}
          >
            <div style={{fontSize: 20, marginBottom: 8}}>{s.emoji}</div>
            <div style={{fontSize: 14, fontWeight: 700, color: activeStepId === s.id ? s.color : "#cbd5e1"}}>{s.title}</div>
            <div style={{fontSize: 11, color: "#64748b"}}>{s.subtitle}</div>
          </button>
        ))}
      </div>

      {step ? (
        <div style={{background: "#0d1117", border: `1px solid ${step.color}40`, borderRadius: 16, overflow: "hidden", marginBottom: 30}}>
          <div style={{padding: "20px 24px", borderBottom: "1px solid #1e293b", background: `linear-gradient(135deg, ${step.color}15, transparent)`, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              <span style={{fontSize: 24}}>{step.emoji}</span>
              <h3 style={{margin: 0, fontSize: 18, color: step.color}}>{step.title}</h3>
            </div>
            <button onClick={() => setActiveStepId(null)} style={{background: "none", border: "1px solid #334155", color: "#64748b", cursor: "pointer", fontSize: 12, padding: "4px 10px", borderRadius: 8}}>fechar ×</button>
          </div>

          <div style={{display: "flex", borderBottom: "1px solid #1e293b", padding: "0 24px"}}>
            {["conceito", "detalhes", "código"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none", border: "none",
                  borderBottom: tab === t ? `2px solid ${step.color}` : "2px solid transparent",
                  color: tab === t ? step.color : "#475569",
                  padding: "14px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600,
                  textTransform: "uppercase", transition: "all 0.2s"
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{padding: "24px"}}>
            {tab === "conceito" && (
              <div>
                <p style={{fontSize: 15, lineHeight: 1.8, color: "#cbd5e1", marginBottom: 20}}>💡 <strong>Analogia:</strong> {step.analogy}</p>
                <p style={{fontSize: 15, lineHeight: 1.8, color: "#e2e8f0", marginBottom: 20}}>{step.what}</p>
                <div style={{display: "grid", gap: 10}}>
                  {step.details.map((d, i) => (
                    <div key={i} style={{padding: "12px 16px", background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 13, color: "#94a3b8"}}>
                      <span style={{color: step.color, marginRight: 10}}>◆</span>{d}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "detalhes" && (
              <div>
                <h4 style={{fontSize: 14, color: step.color, marginBottom: 16, textTransform: "uppercase"}}>{step.deepDive.title}</h4>
                <div style={{fontSize: 14, lineHeight: 1.8, color: "#cbd5e1", whiteSpace: "pre-wrap"}}>{step.deepDive.content}</div>
              </div>
            )}
            {tab === "código" && (
              <div style={{background: "#030508", borderRadius: 10, border: "1px solid #1e293b", overflow: "hidden"}}>
                <div style={{padding: "10px 16px", borderBottom: "1px solid #1e293b", fontSize: 11, color: "#475569", display: "flex", gap: 8}}>
                  <div style={{width:8, height:8, borderRadius:"50%", background:"#ff5f57"}}/>
                  <div style={{width:8, height:8, borderRadius:"50%", background:"#ffbd2e"}}/>
                  <div style={{width:8, height:8, borderRadius:"50%", background:"#28c840"}}/>
                </div>
                <pre style={{padding: "20px", margin: 0, fontSize: 13, color: "#7dd3fc", overflowX: "auto", fontFamily: "monospace"}}>
                  <code>{step.deepDive.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{padding: "60px 20px", textAlign: "center", background: "#0d1117", borderRadius: 16, border: "1px dashed #1e293b"}}>
          <div style={{fontSize: 40, marginBottom: 20}}>🎯</div>
          <div style={{fontSize: 16, color: "#64748b"}}>Selecione um pilar técnico acima para aprofundar.</div>
        </div>
      )}

      {/* Comparison Table */}
      <div style={{background: "#0d1117", border: "1px solid #1e293b", borderRadius: 16, padding: "24px", marginTop: 20}}>
        <h3 style={{fontSize: 16, color: "#e2e8f0", marginBottom: 16}}>Comparativo: Treino em Casa vs. Cluster Enterprise</h3>
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse", fontSize: 13}}>
            <thead>
              <tr style={{borderBottom: "1px solid #1e293b"}}>
                <th style={{textAlign: "left", padding: "12px", color: "#64748b"}}>Recurso</th>
                <th style={{textAlign: "left", padding: "12px", color: "#64748b"}}>RTX 4090 (Home)</th>
                <th style={{textAlign: "left", padding: "12px", color: "#3b82f6"}}>H100 Cluster (Empresa)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: "1px solid #1e293b"}}>
                <td style={{padding: "12px", color: "#cbd5e1"}}>Conexão</td>
                <td style={{padding: "12px", color: "#94a3b8"}}>PCIe Gen4 (32GB/s)</td>
                <td style={{padding: "12px", color: "#10b981"}}>NVLink (900GB/s)</td>
              </tr>
              <tr style={{borderBottom: "1px solid #1e293b"}}>
                <td style={{padding: "12px", color: "#cbd5e1"}}>Memória</td>
                <td style={{padding: "12px", color: "#94a3b8"}}>24GB GDDR6X</td>
                <td style={{padding: "12px", color: "#10b981"}}>80GB-141GB HBM3</td>
              </tr>
              <tr style={{borderBottom: "1px solid #1e293b"}}>
                <td style={{padding: "12px", color: "#cbd5e1"}}>Paralelismo</td>
                <td style={{padding: "12px", color: "#94a3b8"}}>Apenas Data (DDP)</td>
                <td style={{padding: "12px", color: "#10b981"}}>Tensor + Pipeline + ZeRO</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.HPCGuide = HPCGuide;
