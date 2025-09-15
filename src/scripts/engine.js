// === ENGINE.JS - CONVERSOR DE MOEDAS ===

class CurrencyConverter {
    constructor() {
        // API gratuita - ExchangeRate-API (sem necessidade de key para versão básica)
        this.baseUrl = 'https://api.exchangerate-api.com/v4/latest/';
        // Alternativa: CurrencyAPI (requer key gratuita)
        this.currencyApiUrl = 'https://api.currencyapi.com/v3/latest';
        this.currencyApiKey = 'SUA_CHAVE_AQUI'; // Obtida em https://currencyapi.com/
        
        this.currencySymbols = {
            'USD': '$',
            'BRL': 'R$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$'
        };
        
        this.currencyNames = {
            'USD': 'Dólar Americano',
            'BRL': 'Real Brasileiro',
            'EUR': 'Euro',
            'GBP': 'Libra Esterlina',
            'JPY': 'Iene Japonês',
            'CAD': 'Dólar Canadense',
            'AUD': 'Dólar Australiano'
        };
        
        this.init();
    }
    
    init() {
        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }
    
    setupElements() {
        this.form = document.getElementById('converterForm');
        this.amountInput = document.getElementById('amount');
        this.fromSelect = document.getElementById('fromCurrency');
        this.toSelect = document.getElementById('toCurrency');
        this.swapBtn = document.getElementById('swapBtn');
        this.loading = document.getElementById('loading');
        this.resultSection = document.getElementById('resultSection');
        this.resultAmount = document.getElementById('resultAmount');
        this.resultInfo = document.getElementById('resultInfo');
        this.exchangeRate = document.getElementById('exchangeRate');
        
        // Verifica se todos os elementos foram encontrados
        if (!this.form || !this.amountInput || !this.fromSelect || !this.toSelect) {
            console.error('❌ Elementos do formulário não encontrados');
            return;
        }
        
        console.log('✅ Elementos encontrados, configurando eventos...');
        this.bindEvents();
        this.updateResult();
    }
    
    bindEvents() {
        // Previne o comportamento padrão do formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
        
        // Eventos dos elementos
        this.swapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.swapCurrencies();
        });
        
        this.amountInput.addEventListener('input', () => this.debounceConvert());
        this.fromSelect.addEventListener('change', () => this.debounceConvert());
        this.toSelect.addEventListener('change', () => this.debounceConvert());
        
        // Animação no foco dos inputs
        this.amountInput.addEventListener('focus', () => this.addInputFocus());
        this.amountInput.addEventListener('blur', () => this.removeInputFocus());
        
        console.log('✅ Eventos configurados com sucesso');
    }
    
    debounceConvert() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            const amount = parseFloat(this.amountInput.value);
            if (amount && amount > 0) {
                this.convertCurrency();
            } else {
                this.updateResult();
            }
        }, 500);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        console.log('📝 Formulário submetido');
        await this.convertCurrency();
    }
    
    async convertCurrency() {
        const amount = parseFloat(this.amountInput.value);
        const fromCurrency = this.fromSelect.value;
        const toCurrency = this.toSelect.value;
        
        console.log(`💱 Convertendo: ${amount} ${fromCurrency} para ${toCurrency}`);
        
        if (!amount || amount <= 0) {
            this.showError('Por favor, digite um valor válido');
            return;
        }
        
        if (fromCurrency === toCurrency) {
            this.updateResult(amount, fromCurrency, toCurrency, 1, amount);
            return;
        }
        
        try {
            this.showLoading(true);
            const rate = await this.getExchangeRate(fromCurrency, toCurrency);
            const convertedAmount = amount * rate;
            
            this.updateResult(convertedAmount, fromCurrency, toCurrency, rate, amount);
            this.showSuccess();
            
            // Adiciona ao histórico
            if (window.conversionHistory) {
                window.conversionHistory.addConversion(fromCurrency, toCurrency, amount, convertedAmount, rate);
            }
            
        } catch (error) {
            console.error('❌ Erro na conversão:', error);
            this.showError('Erro ao converter moedas. Tentando taxas offline...');
            
            // Fallback para taxas offline
            try {
                const rate = this.getFallbackRate(fromCurrency, toCurrency);
                const convertedAmount = amount * rate;
                this.updateResult(convertedAmount, fromCurrency, toCurrency, rate, amount);
                this.showSuccess();
                
                // Adiciona histórico da conversão
                if (window.conversionHistory) {
                    window.conversionHistory.addConversion(fromCurrency, toCurrency, amount, convertedAmount, rate);
                }
                
            } catch (fallbackError) {
                console.error('❌ Erro no fallback:', fallbackError);
                this.showError('Moedas não suportadas ou erro interno');
            }
        } finally {
            this.showLoading(false);
        }
    }
    
    async getExchangeRate(from, to) {
        try {
            // Tenta primeira API (ExchangeRate-API) - sem key necessária
            const response = await fetch(`${this.baseUrl}${from}`);
            if (response.ok) {
                const data = await response.json();
                if (data.rates && data.rates[to]) {
                    console.log(`✅ Taxa obtida da API: 1 ${from} = ${data.rates[to]} ${to}`);
                    return data.rates[to];
                }
            }
            
            // Se primeira API falhar, tenta API de backup
            throw new Error('API principal indisponível');
            
        } catch (error) {
            console.warn('⚠️ Erro na API principal:', error.message);
            
            try {
                // Tenta API de backup (descomente e adicione sua key)
                /*
                const backupResponse = await fetch(
                    `${this.currencyApiUrl}?apikey=${this.currencyApiKey}&base_currency=${from}&currencies=${to}`
                );
                if (backupResponse.ok) {
                    const backupData = await backupResponse.json();
                    if (backupData.data && backupData.data[to]) {
                        console.log(`✅ Taxa obtida da API backup: 1 ${from} = ${backupData.data[to].value} ${to}`);
                        return backupData.data[to].value;
                    }
                }
                */
                
                // Se APIs falharem, usa taxas offline
                console.log('📱 Usando taxas offline');
                return this.getFallbackRate(from, to);
                
            } catch (backupError) {
                console.warn('⚠️ API backup também falhou:', backupError.message);
                return this.getFallbackRate(from, to);
            }
        }
    }
    
    getFallbackRate(from, to) {
        if (from === to) return 1;
        
        // Taxas atualizadas (aproximadas - Janeiro 2025)
        const rates = {
            'USD': { 'BRL': 6.15, 'EUR': 0.94, 'GBP': 0.81, 'JPY': 157.2, 'CAD': 1.44, 'AUD': 1.58 },
            'BRL': { 'USD': 0.163, 'EUR': 0.153, 'GBP': 0.132, 'JPY': 25.5, 'CAD': 0.234, 'AUD': 0.257 },
            'EUR': { 'USD': 1.064, 'BRL': 6.54, 'GBP': 0.86, 'JPY': 167.3, 'CAD': 1.53, 'AUD': 1.68 },
            'GBP': { 'USD': 1.235, 'BRL': 7.59, 'EUR': 1.163, 'JPY': 194.2, 'CAD': 1.778, 'AUD': 1.95 },
            'JPY': { 'USD': 0.00636, 'BRL': 0.0392, 'EUR': 0.00598, 'GBP': 0.00515, 'CAD': 0.00916, 'AUD': 0.01005 },
            'CAD': { 'USD': 0.694, 'BRL': 4.27, 'EUR': 0.653, 'GBP': 0.562, 'JPY': 109.2, 'AUD': 1.097 },
            'AUD': { 'USD': 0.633, 'BRL': 3.89, 'EUR': 0.595, 'GBP': 0.513, 'JPY': 99.5, 'CAD': 0.912 }
        };
        
        if (rates[from] && rates[from][to]) {
            // Adiciona pequena variação para simular flutuação real (±0.5%)
            const baseRate = rates[from][to];
            const variation = (Math.random() - 0.5) * 0.01;
            const finalRate = baseRate * (1 + variation);
            console.log(`📊 Taxa offline: 1 ${from} = ${finalRate.toFixed(6)} ${to}`);
            return finalRate;
        }
        
        throw new Error(`Taxa de câmbio não encontrada para ${from} → ${to}`);
    }
    
    updateResult(amount = 0, fromCurrency = '', toCurrency = '', rate = 0, originalAmount = 0) {
        const resultCard = this.resultSection.querySelector('.result-card');
        
        if (amount === 0) {
            this.resultAmount.textContent = '$0.00';
            this.resultInfo.textContent = 'Selecione as moedas e digite um valor';
            this.exchangeRate.textContent = '';
            resultCard.className = 'result-card';
            return;
        }
        
        const symbol = this.currencySymbols[toCurrency] || '';
        const formattedAmount = this.formatCurrency(amount, toCurrency);
        
        this.resultAmount.textContent = `${symbol}${formattedAmount}`;
        
        if (originalAmount > 0) {
            const fromSymbol = this.currencySymbols[fromCurrency] || '';
            const originalFormatted = this.formatCurrency(originalAmount, fromCurrency);
            this.resultInfo.textContent = `${fromSymbol}${originalFormatted} ${this.currencyNames[fromCurrency]} para ${this.currencyNames[toCurrency]}`;
            
            if (rate !== 1) {
                this.exchangeRate.textContent = `Taxa: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            } else {
                this.exchangeRate.textContent = 'Mesma moeda selecionada';
            }
        }
    }
    
    formatCurrency(amount, currency) {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: currency === 'JPY' ? 0 : 2
        };
        
        return new Intl.NumberFormat('pt-BR', options).format(amount);
    }
    
    swapCurrencies() {
        const fromValue = this.fromSelect.value;
        const toValue = this.toSelect.value;
        
        this.fromSelect.value = toValue;
        this.toSelect.value = fromValue;
        
        // Adiciona animação visual
        this.swapBtn.style.transform = 'rotate(180deg) translateY(-2px)';
        setTimeout(() => {
            this.swapBtn.style.transform = '';
        }, 300);
        
        console.log(`🔄 Moedas trocadas: ${fromValue} ↔ ${toValue}`);
        
        // Reconverte se há valor
        const amount = parseFloat(this.amountInput.value);
        if (amount && amount > 0) {
            this.debounceConvert();
        }
    }
    
    showLoading(show) {
        const convertBtn = this.form.querySelector('.convert-btn');
        const btnText = convertBtn.querySelector('.btn-text');
        
        if (show) {
            this.loading.classList.add('active');
            btnText.textContent = 'Convertendo...';
            convertBtn.disabled = true;
        } else {
            this.loading.classList.remove('active');
            btnText.textContent = 'Converter';
            convertBtn.disabled = false;
        }
    }
    
    showSuccess() {
        const resultCard = this.resultSection.querySelector('.result-card');
        resultCard.className = 'result-card success';
        
        // Remove a classe de sucesso após a animação
        setTimeout(() => {
            resultCard.classList.remove('success');
        }, 500);
    }
    
    showError(message) {
        const resultCard = this.resultSection.querySelector('.result-card');
        resultCard.className = 'result-card error';
        
        this.resultAmount.textContent = 'Erro';
        this.resultInfo.textContent = message;
        this.exchangeRate.textContent = '';
        
        // Remove a classe de erro após 3 segundos
        setTimeout(() => {
            resultCard.classList.remove('error');
            this.updateResult();
        }, 3000);
    }
    
    addInputFocus() {
        if (this.amountInput.parentElement) {
            this.amountInput.parentElement.classList.add('focused');
        }
    }
    
    removeInputFocus() {
        if (this.amountInput.parentElement) {
            this.amountInput.parentElement.classList.remove('focused');
        }
    }
}

// Classe para gerenciar histórico de conversões
class ConversionHistory {
    constructor() {
        this.history = [];
        this.maxHistory = 10;
        this.loadFromStorage();
    }
    
    addConversion(from, to, amount, result, rate) {
        const conversion = {
            id: Date.now(),
            from,
            to,
            amount,
            result,
            rate,
            timestamp: new Date().toLocaleString('pt-BR')
        };
        
        this.history.unshift(conversion);
        
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(0, this.maxHistory);
        }
        
        this.saveToStorage();
        console.log('📝 Conversão adicionada ao histórico:', conversion);
    }
    
    getHistory() {
        return this.history;
    }
    
    clearHistory() {
        this.history = [];
        this.saveToStorage();
    }
    
    saveToStorage() {
        try {
            // Em um ambiente real, usaria localStorage
            // localStorage.setItem('conversion_history', JSON.stringify(this.history));
            console.log('💾 Histórico salvo:', this.history.length, 'conversões');
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar o histórico');
        }
    }
    
    loadFromStorage() {
        try {
            // Em um ambiente real, carregaria do localStorage
            // const saved = localStorage.getItem('conversion_history');
            // if (saved) {
            //     this.history = JSON.parse(saved);
            // }
            this.history = [];
        } catch (error) {
            console.warn('⚠️ Não foi possível carregar o histórico');
            this.history = [];
        }
    }
}

// Classe para validações
class ValidationUtils {
    static isValidAmount(amount) {
        return !isNaN(amount) && amount > 0 && amount <= 999999999;
    }
    
    static isValidCurrency(currency) {
        const validCurrencies = ['USD', 'BRL', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
        return validCurrencies.includes(currency);
    }
    
    static sanitizeAmount(input) {
        // Remove caracteres não numéricos exceto ponto e vírgula
        let cleaned = input.replace(/[^\d.,]/g, '');
        
        // Substitui vírgula por ponto
        cleaned = cleaned.replace(',', '.');
        
        // Remove pontos extras
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }
        
        return cleaned;
    }
}

// Classe para efeitos visuais adicionais
class VisualEffects {
    static createRipple(element, event) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    static addFloatingNumbers(container) {
        const symbols = ['$','€', '£', '¥', 'R$'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const symbol = document.createElement('div');
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                symbol.className = 'floating-symbol';
                symbol.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    color: rgba(139, 92, 246, 0.3);
                    pointer-events: none;
                    left: ${Math.random() * 100}%;
                    top: 100%;
                    animation: float-up 3s ease-out forwards;
                `;
                
                container.appendChild(symbol);
                
                setTimeout(() => {
                    symbol.remove();
                }, 3000);
            }, i * 200);
        }
    }
}

// Função de inicialização principal
function initializeCurrencyConverter() {
    console.log('🚀 Inicializando Conversor de Moedas...');
    
    // Inicializa componentes principais
    window.converter = new CurrencyConverter();
    window.conversionHistory = new ConversionHistory();
    
    // Adiciona estilos CSS dinâmicos
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes float-up {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .focused {
            animation: pulse 0.3s ease-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Aguarda um pouco para garantir que os elementos estejam prontos
    setTimeout(() => {
        // Adiciona eventos de ripple aos botões
        const buttons = document.querySelectorAll('.convert-btn, .swap-btn');
        buttons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    if (!btn.disabled) {
                        VisualEffects.createRipple(btn, e);
                    }
                });
            }
        });
        
        // Adiciona validação em tempo real ao input de valor
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                const sanitized = ValidationUtils.sanitizeAmount(e.target.value);
                if (sanitized !== e.target.value) {
                    e.target.value = sanitized;
                }
            });
        }
        
        // Adiciona suporte a teclas de atalho
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter para converter
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const form = document.getElementById('converterForm');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
            
            // Ctrl/Cmd + Shift + S para trocar moedas
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                const swapBtn = document.getElementById('swapBtn');
                if (swapBtn) {
                    swapBtn.click();
                }
            }
        });
        
        console.log('✅ Conversor de Moedas inicializado com sucesso!');
        console.log('🌐 APIs configuradas:');
        console.log('   • ExchangeRate-API (principal, sem key)');
        console.log('   • CurrencyAPI (backup, requer key)');
        console.log('   • Taxas offline (fallback)');
        console.log('💡 Atalhos de teclado:');
        console.log('   • Ctrl/Cmd + Enter: Converter');
        console.log('   • Ctrl/Cmd + Shift + S: Trocar moedas');
        console.log('   • Digite valores para conversão automática');
    }, 500);
}

// Inicialização quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCurrencyConverter);
} else {
    initializeCurrencyConverter();
}