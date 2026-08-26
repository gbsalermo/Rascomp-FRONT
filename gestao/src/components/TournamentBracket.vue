<script setup lang="ts">
import { computed } from 'vue'
import type { Match, MatchResult } from '../types'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{
  matches: Match[]
  results: MatchResult[]
  readOnly?: boolean
}>()

const emit = defineEmits<{
  register: [match: Match]
}>()

const rounds = computed(() =>
  [...new Set(props.matches.map((item) => item.rodada))].sort((a, b) => a - b)
)

const maxRound = computed(() => Math.max(0, ...rounds.value))
const gridRows = computed(() => Math.max(1, Math.pow(2, maxRound.value) - 1))

function roundName(round: number) {
  const remaining = maxRound.value - round
  if (remaining === 0) return 'Final'
  if (remaining === 1) return 'Semifinal'
  if (remaining === 2) return 'Quartas de final'
  if (remaining === 3) return 'Oitavas de final'
  return `Rodada ${round}`
}

function matchGridStyle(match: Match) {
  const row = (2 * match.ordem - 1) * Math.pow(2, match.rodada - 1)
  const branch = 164 * Math.pow(2, match.rodada - 1)
  return {
    gridColumn: String(match.rodada),
    gridRow: String(row),
    '--branch-size': `${branch}px`
  }
}

function resultFor(matchId: number) {
  return props.results.find((item) => item.matchId === matchId)
}

function scoreFor(match: Match, side: 'A' | 'B') {
  const result = resultFor(match.id)
  if (!result) return undefined
  return side === 'A' ? result.pontosA : result.pontosB
}

function isWinner(match: Match, registrationId?: number) {
  const result = resultFor(match.id)
  return Boolean(result?.winnerRegistrationId && registrationId === result.winnerRegistrationId)
}

function canRegister(match: Match) {
  return !props.readOnly
    && Boolean(match.registrationAId)
    && Boolean(match.registrationBId)
    && match.status !== 'FINALIZADA'
    && match.status !== 'CANCELADA'
    && match.status !== 'BYE'
    && match.status !== 'AGUARDANDO_PARTICIPANTES'
}
</script>

<template>
  <section class="tournament-shell">
    <div v-if="!matches.length" class="bracket-empty">
      Nenhuma partida — gere ou selecione um chaveamento.
    </div>

    <div v-else class="bracket-scroll">
      <div
        class="stage-headings"
        :style="{ gridTemplateColumns: `repeat(${maxRound}, minmax(230px, 1fr))` }"
      >
        <div v-for="round in rounds" :key="round" class="stage-heading">
          <span>{{ roundName(round) }}</span>
          <small>Rodada {{ round }}</small>
        </div>
      </div>

      <div
        class="bracket-grid"
        :style="{
          gridTemplateColumns: `repeat(${maxRound}, minmax(230px, 1fr))`,
          gridTemplateRows: `repeat(${gridRows}, 146px)`
        }"
      >
        <article
          v-for="match in matches"
          :key="match.id"
          class="bracket-match"
          :class="[
            `round-${match.rodada}`,
            {
              'is-final': match.rodada === maxRound,
              'is-upper': match.ordem % 2 === 1,
              'is-lower': match.ordem % 2 === 0,
              'has-result': Boolean(resultFor(match.id))
            }
          ]"
          :style="matchGridStyle(match)"
        >
          <span v-if="match.rodada < maxRound" class="branch-line" aria-hidden="true" />

          <header class="match-head">
            <span>Partida {{ match.ordem }}</span>
            <StatusBadge :value="match.status" />
          </header>

          <div
            class="competitor-row"
            :class="{ winner: isWinner(match, match.registrationAId) }"
          >
            <span class="seed-dot">A</span>
            <strong>{{ match.robotANome || 'A definir' }}</strong>
            <b v-if="scoreFor(match, 'A') !== undefined">{{ scoreFor(match, 'A') }}</b>
          </div>

          <div
            class="competitor-row"
            :class="{ winner: isWinner(match, match.registrationBId) }"
          >
            <span class="seed-dot">B</span>
            <strong>{{ match.robotBNome || 'A definir' }}</strong>
            <b v-if="scoreFor(match, 'B') !== undefined">{{ scoreFor(match, 'B') }}</b>
          </div>

          <footer class="match-foot">
            <span v-if="resultFor(match.id)" class="winner-note">
              {{ resultFor(match.id)?.winnerRobotNome }} avançou
            </span>
            <button
              v-else-if="canRegister(match)"
              type="button"
              class="battle-action"
              @click="emit('register', match)"
            >
              Registrar batalha
            </button>
            <span v-else-if="readOnly" class="read-only-note">Somente leitura</span>
          </footer>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tournament-shell {
  border: 1px solid #eadfe5;
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
}

.bracket-empty {
  padding: 34px;
  text-align: center;
  color: #776b72;
}

.bracket-scroll {
  overflow-x: auto;
  padding: 22px 24px 28px;
}

.stage-headings,
.bracket-grid {
  min-width: max(760px, 100%);
  column-gap: 56px;
}

.stage-headings {
  display: grid;
  margin-bottom: 18px;
}

.stage-heading {
  padding: 0 2px 12px;
  border-bottom: 3px solid #d7a9b9;
}

.stage-heading:last-child {
  border-bottom-color: #a91243;
}

.stage-heading span {
  display: block;
  color: #8f1238;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.stage-heading small {
  color: #7f6b74;
  font-size: 11px;
  font-weight: 600;
}

.bracket-grid {
  display: grid;
  row-gap: 18px;
  align-items: center;
}

.bracket-match {
  position: relative;
  align-self: center;
  z-index: 2;
  border: 1px solid #dcc8d1;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(67, 20, 43, .07);
  overflow: visible;
}

.bracket-match.is-final {
  border: 2px solid #c94b75;
  background: linear-gradient(180deg, #fff 0%, #fff7fa 100%);
  box-shadow: 0 14px 32px rgba(143, 18, 56, .14);
}

.bracket-match.is-final .match-head {
  background: #fff1f5;
  border-bottom-color: #efd2dc;
}

.bracket-match:not(.round-1)::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 50%;
  width: 28px;
  border-top: 4px solid #bd6f8b;
}

.bracket-match:not(.is-final)::after {
  content: '';
  position: absolute;
  right: -28px;
  top: 50%;
  width: 28px;
  border-top: 4px solid #bd6f8b;
}

.branch-line {
  position: absolute;
  right: -29px;
  width: 4px;
  background: #bd6f8b;
}

.has-result:not(.is-final)::after,
.has-result .branch-line {
  border-color: #9f0f3b;
  background: #9f0f3b;
}

.is-upper .branch-line {
  top: 50%;
  height: var(--branch-size);
}

.is-lower .branch-line {
  bottom: 50%;
  height: var(--branch-size);
}

.match-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid #f0e8ec;
  background: #fbf8fa;
  border-radius: 14px 14px 0 0;
  color: #6f5d65;
  font-size: 11px;
  font-weight: 800;
}

.competitor-row {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 6px 10px;
  border-bottom: 1px solid #f3edf0;
}

.competitor-row.winner {
  background: linear-gradient(90deg, #fff0f5 0%, #fff7f9 100%);
  color: #9f0f3b;
  font-weight: 700;
}

.competitor-row.winner strong {
  font-weight: 800;
}

.competitor-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.competitor-row b {
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #f3e7ec;
  color: #8f1238;
  font-weight: 800;
}

.competitor-row.winner b {
  background: #9f0f3b;
  color: #fff;
}

.seed-dot {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f1ebee;
  color: #766970;
  font-size: 9px;
  font-weight: 800;
}

.match-foot {
  min-height: 34px;
  display: flex;
  align-items: center;
  padding: 5px 10px 7px;
}

.battle-action {
  border: 0;
  padding: 0;
  background: transparent;
  color: #9f0f3b;
  font: inherit;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.battle-action:hover { text-decoration: underline; }
.winner-note { color: #1f714d; font-size: 11px; font-weight: 800; }
.read-only-note { color: #8c8187; font-size: 11px; }

@media (max-width: 760px) {
  .bracket-scroll { padding: 18px; }
  .stage-headings,
  .bracket-grid { min-width: 760px; }
}
</style>
