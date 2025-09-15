# 💱 Conversor de Moedas

Uma aplicação web moderna e responsiva para conversão de moedas em tempo real, desenvolvida com JavaScript vanilla, HTML5 e CSS3.

## 🌟 Características

- **Interface Moderna**: Design limpo com gradientes roxos e animações suaves
- **Responsivo**: Otimizado para desktop, tablet e dispositivos móveis
- **Conversão em Tempo Real**: Atualização automática conforme você digita
- **Múltiplas APIs**: Sistema robusto com fallback para garantir funcionamento
- **Offline Ready**: Taxas de câmbio offline como backup
- **Acessibilidade**: Suporte completo a screen readers e navegação por teclado

## 🚀 Demo

[Ver Demo ao Vivo](https://devalex-full.github.io/conversor-moedas) _(substitua pelo seu link)_

## 📱 Capturas de Tela

### Desktop
![Desktop Screenshot](./screenshots/desktop.png)

### Mobile
![Mobile Screenshot](./screenshots/mobile.png)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: ExchangeRate-API, CurrencyAPI (backup)
- **Fontes**: Google Fonts (Poppins)
- **Metodologia**: CSS Grid, Flexbox, Mobile First

## 💰 Moedas Suportadas

- 🇺🇸 **USD** - Dólar Americano
- 🇧🇷 **BRL** - Real Brasileiro  
- 🇪🇺 **EUR** - Euro
- 🇬🇧 **GBP** - Libra Esterlina
- 🇯🇵 **JPY** - Iene Japonês
- 🇨🇦 **CAD** - Dólar Canadense
- 🇦🇺 **AUD** - Dólar Australiano

## ⚡ Funcionalidades

### Principais
- ✅ Conversão automática durante digitação
- ✅ Troca rápida entre moedas (botão swap)
- ✅ Formatação localizada dos valores
- ✅ Validação de entrada em tempo real
- ✅ Estados de loading e erro
- ✅ Animações e feedback visual

### Avançadas
- 🔄 Sistema de fallback com múltiplas APIs
- 📱 Design totalmente responsivo
- ⌨️ Atalhos de teclado (Ctrl+Enter, Ctrl+Shift+S)
- 🎨 Efeitos visuais (ripple, animações CSS)
- 💾 Histórico de conversões (em desenvolvimento)

## 🏗️ Instalação e Uso

### Pré-requisitos
- Navegador web moderno
- Servidor web local (opcional, para desenvolvimento)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/DevAlex-full/conversor-moedas.git
   cd conversor-moedas
   ```

2. **Abra o arquivo**
   ```bash
   # Opção 1: Abrir diretamente no navegador
   open index.html
   
   # Opção 2: Servidor local (Python)
   python -m http.server 8000
   # Acesse http://localhost:8000
   
   # Opção 3: Live Server (VS Code)
   # Instale a extensão Live Server e clique com botão direito em index.html
   ```

### Configuração das APIs (Opcional)

Para taxas de câmbio mais precisas, configure uma chave da API:

1. Registre-se em [CurrencyAPI](https://currencyapi.com/)
2. Obtenha sua chave gratuita
3. Edite `src/scripts/engine.js`:
   ```javascript
   this.currencyApiKey = 'SUA_CHAVE_AQUI';
   ```

## 📂 Estrutura do Projeto

```
conversor-moedas/
├── index.html              # Página principal
├── src/
│   ├── css/
│   │   ├── reset.css       # Reset CSS
│   │   └── main.css        # Estilos principais
│   └── scripts/
│       └── engine.js       # Lógica da aplicação
├── screenshots/            # Capturas de tela
├── README.md              # Este arquivo
└── LICENSE                # Licença do projeto
```

## 🎯 Como Usar

1. **Digite o valor** que deseja converter
2. **Selecione a moeda de origem** no primeiro dropdown
3. **Selecione a moeda de destino** no segundo dropdown
4. **Veja o resultado** atualizado automaticamente
5. **Use o botão de troca** (⇄) para inverter as moedas

### Atalhos de Teclado
- `Ctrl/Cmd + Enter`: Forçar conversão
- `Ctrl/Cmd + Shift + S`: Trocar moedas

## 🔧 Personalização

### Cores e Tema
As variáveis CSS estão centralizadas em `:root` no arquivo `main.css`:

```css
:root {
    --primary-purple: #8B5CF6;
    --secondary-purple: #A78BFA;
    --dark-purple: #6D28D9;
    --accent-purple: #EC4899;
    /* ... outras variáveis */
}
```

### Adicionar Nova Moeda
1. Edite o array de moedas em `engine.js`
2. Adicione os símbolos e nomes correspondentes
3. Atualize as taxas de fallback

## 📊 APIs Utilizadas

### Principal: ExchangeRate-API
- **URL**: `https://api.exchangerate-api.com/v4/latest/`
- **Limitações**: 1500 requests/mês (gratuito)
- **Vantagem**: Sem necessidade de chave API

### Backup: CurrencyAPI
- **URL**: `https://api.currencyapi.com/v3/latest`
- **Limitações**: 300 requests/mês (gratuito)
- **Vantagem**: Mais precisa e confiável

### Fallback: Taxas Offline
- Taxas fixas atualizadas manualmente
- Garantem funcionamento mesmo sem internet
- Incluem pequena variação para simular flutuação

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dispositivos
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Ideias para Contribuição
- 📈 Gráficos de histórico de taxas
- 🔔 Notificações de mudanças significativas
- 🌍 Mais moedas suportadas
- 📱 PWA (Progressive Web App)
- 🎨 Temas alternativos

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**DevAlex-full**
- GitHub: [@DevAlex-full](https://github.com/DevAlex-full)

## 🙏 Agradecimentos

- [ExchangeRate-API](https://exchangerate-api.com/) pelos dados de câmbio
- [Google Fonts](https://fonts.google.com/) pela fonte Poppins
- [CurrencyAPI](https://currencyapi.com/) pela API de backup
- Comunidade open source pelas inspirações

## 📈 Roadmap

### v1.1.0 (Em Desenvolvimento)
- [ ] Histórico de conversões persistente
- [ ] Gráfico de tendências
- [ ] Modo escuro/claro
- [ ] Calculadora de gastos em viagem

### v1.2.0 (Planejado)
- [ ] PWA com funcionamento offline
- [ ] Notificações push
- [ ] Mais moedas e criptomoedas
- [ ] API própria para taxas

---

⭐ Se este projeto foi útil, considere dar uma estrela!

**Versão atual: v1.0.0**  
**Status: 🟢 Online e Funcional**
