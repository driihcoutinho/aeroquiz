# Design Guidelines - AeroQuiz PWA

## Overview
AeroQuiz é uma Progressive Web App (PWA) de quiz de aviação com design moderno e imersivo, utilizando uma **paleta amarela/escura** profissional com tema dark mode exclusivo.

## Color Palette

### Yellow/Dark Theme (Dark Mode Only)

**Background & Surfaces:**
- Dark Navy `#192230` (210° 18% 12%) - Background principal
- Dark Gray `#3d474e` (210° 13% 16%) - Cards e superfícies
- Darker Gray `#2c2f38` (210° 10% 23%) - Elementos secundários

**Primary Colors:**
- Vibrant Yellow `#ffcd00` (48° 100% 50%) - Accent principal, botões, destaques
- Dark Navy `#192230` - Texto sobre amarelo

**Functional Colors:**
- Success Green Light `#d1f4e0` - Background de respostas corretas
- Success Green Border `#22c55e` - Bordas de respostas corretas
- Success Green Dark `#15803d` - Texto de respostas corretas
- Error Pink Light `#ffd4d4` - Background de respostas incorretas
- Error Red Border `#ef4444` - Bordas de respostas incorretas
- Error Red Dark `#991b1b` - Texto de respostas incorretas
- Text Primary `#FAFAFA` (0° 0% 98%) - Texto principal
- Text Secondary `#A6A6A6` (0° 0% 65%) - Texto secundário/muted

**Borders & Dividers:**
- Border `#3a4149` (210° 10% 25%)

## Typography

**Font Family:**
- System fonts: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**Font Sizes:**
- Título principal: 3rem (48px) - Ultra bold
- Subtítulo: 2rem (32px) - Bold
- Questão: 1.5rem (24px) - Semibold
- Texto normal: 1rem (16px) - Regular
- Texto pequeno: 0.875rem (14px) - Regular

## Layout Principles

### Answer Options Layout
- **Vertical List**: Respostas dispostas verticalmente (layout limpo)
- Cards espaçados com 12px de gap
- Padding interno de 24px por opção
- Border radius de 24px
- Transição suave ao hover

### Quiz Screen Structure

**1. Header Bar (sticky top):**
- Botão "Início" (esquerda) - Volta para home
- Indicador de progresso: "05 / 391" (centro)
- Sem timer visível (removido)
- Background: Dark gray com transparência

**2. Progress Bar:**
- Barra amarela linear abaixo do header
- Width corresponde à porcentagem de conclusão
- Transições suaves animadas

**3. Question Card:**
- Background: Dark gray (#3d474e)
- Badge de categoria no topo
- Texto da questão: Grande, legível, bold
- Padding generoso para leitura confortável
- Border radius arredondado

**4. Answer Options:**
- Lista vertical de 4 opções
- Cada opção: Card full-width
- Estados:
  - Default: Dark gray com borda sutil
  - Hover: Leve elevação
  - Correto: Verde claro (#d1f4e0) com borda verde (#22c55e)
  - Incorreto: Rosa claro (#ffd4d4) com borda vermelha (#ef4444)
- Ícones: Check (✓) ou X posicionados à direita

**5. Next Button:**
- Botão amarelo (#ffcd00) no fundo
- Rounded, proeminente
- Centralizado
- Aparece após resposta selecionada

## Special Features

### Module Selection (Home Screen)
- 4 botões de módulo independentes
- Badge "Em progresso" em amarelo quando há progresso salvo
- Indicação de questão atual (ex: "Questão 45")
- Contagem total de questões por módulo

### Progress Saving System
- Badge amarelo "Em progresso" nos módulos
- Dialog de retomada com 3 opções:
  - Cancelar (secondary)
  - Começar Novo (secondary com ícone)
  - Continuar (primary amarelo com ícone)
- Indicador visual da questão atual

### Results Screen
- Background: Dark navy (#192230)
- Card central: Dark gray com borda
- Troféu amarelo grande no topo
- "Módulo Concluído!" em banner amarelo
- Grid 2 colunas:
  - Acertos: Verde claro com borda verde
  - Erros: Rosa claro com borda vermelha
- Dois botões:
  - "Reiniciar Módulo" (primary amarelo)
  - "Início" (outline)

## Animations

- Transições suaves (300ms)
- Fade in/out para questões
- Scale sutil ao hover em botões
- Progress bar com easing suave
- Dialog com fade + scale

## Responsive Behavior

- **Mobile-first**: Otimizado para retrato em celular
- **Tablet/Desktop**: Mesma estrutura vertical, espaçamento maior
- **Max width**: max-w-2xl para legibilidade
- Cards adaptam padding em telas maiores

## PWA Considerations

- **Dark mode only**: Tema escuro consistente
- **No light mode**: App projetado para ambiente escuro
- **Imersivo**: Experiência full-screen
- **Offline**: Service worker para uso sem conexão

## Key Principles

1. **Simplicidade**: Interface limpa, sem distrações
2. **Clareza**: Feedback visual imediato e óbvio
3. **Continuidade**: Sistema de salvamento automático de progresso
4. **Modularidade**: Cada módulo é independente
5. **Acessibilidade**: Alto contraste, estados de foco claros
6. **Performance**: Transições suaves, sem lag

**Filosofia de Design**: Experiência focada no aprendizado com estética profissional em amarelo/escuro. Cada elemento serve a um propósito sem sobrecarregar o usuário.
