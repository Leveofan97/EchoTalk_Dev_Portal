<template>
  <div class="runtime-protection-header">
    <div>
      <h4>Runtime Protection</h4>
      <p>Rate limiting, burst protection и auto-block для выбранной установки</p>
    </div>

    <div class="runtime-actions">
      <span :class="['runtime-status-badge', runtimeProtectionStatusClass]">
        {{ runtimeProtectionStatusText }}
      </span>

      <Button
        variant="ghost"
        size="sm"
        :loading="runtimeProtectionLoading"
        @click="loadRuntimeProtection"
      >
        Обновить
      </Button>
    </div>
  </div>

  <div v-if="runtimeProtectionError" class="runtime-error">
    {{ runtimeProtectionError }}
  </div>

  <div class="runtime-summary">
    <div>
      <span>Violations</span>
      <strong> {{ runtimeStats.violation_count }} / {{ runtimeStats.violation_limit }} </strong>
    </div>

    <div>
      <span>Retry after</span>
      <strong>{{ runtimeStats.retry_after_sec || 0 }} сек.</strong>
    </div>

    <div>
      <span>Block reason</span>
      <strong>{{ runtimeStats.block_reason || '—' }}</strong>
    </div>
  </div>

  <div v-if="runtimeStats.blocked" class="runtime-blocked">
    <div>
      <strong>Installation временно заблокирована</strong>
      <p>Blocked until: {{ runtimeStats.blocked_until || '—' }}</p>
    </div>

    <Button
      variant="danger"
      size="sm"
      :loading="runtimeProtectionSaving"
      @click="unblockRuntimeProtection"
    >
      Разблокировать
    </Button>
  </div>

  <div class="runtime-grid">
    <label>
      <span>Protection enabled</span>
      <input v-model="runtimeLimits.enabled" type="checkbox" />
    </label>

    <label>
      <span>Requests / minute</span>
      <input v-model.number="runtimeLimits.requests_per_minute" type="number" min="0" />
    </label>

    <label>
      <span>Messages / minute</span>
      <input v-model.number="runtimeLimits.messages_per_minute" type="number" min="0" />
    </label>

    <label>
      <span>Interactions / minute</span>
      <input v-model.number="runtimeLimits.interactions_per_minute" type="number" min="0" />
    </label>

    <label>
      <span>Gateway sessions / minute</span>
      <input v-model.number="runtimeLimits.gateway_sessions_per_minute" type="number" min="0" />
    </label>

    <label>
      <span>Gateway connections / minute</span>
      <input v-model.number="runtimeLimits.gateway_connections_per_minute" type="number" min="0" />
    </label>

    <label>
      <span>Message burst limit</span>
      <input v-model.number="runtimeLimits.burst_messages_limit" type="number" min="0" />
    </label>

    <label>
      <span>Message burst window, sec</span>
      <input v-model.number="runtimeLimits.burst_messages_window_sec" type="number" min="0" />
    </label>

    <label>
      <span>Interaction burst limit</span>
      <input v-model.number="runtimeLimits.burst_interactions_limit" type="number" min="0" />
    </label>

    <label>
      <span>Interaction burst window, sec</span>
      <input v-model.number="runtimeLimits.burst_interactions_window_sec" type="number" min="0" />
    </label>

    <label>
      <span>Violation limit</span>
      <input v-model.number="runtimeLimits.violation_limit" type="number" min="0" />
    </label>

    <label>
      <span>Violation window, sec</span>
      <input v-model.number="runtimeLimits.violation_window_sec" type="number" min="0" />
    </label>

    <label>
      <span>Auto-block duration, sec</span>
      <input v-model.number="runtimeLimits.auto_block_duration_sec" type="number" min="0" />
    </label>
  </div>

  <div class="runtime-footer">
    <Button variant="primary" :loading="runtimeProtectionSaving" @click="saveRuntimeProtection">
      Сохранить Runtime Protection
    </Button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
