import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// Speech options are kept flat here (bridge contract).
// The JS API groups them under `speech: {}` and flattens before calling native.
type AnnounceOptions = Readonly<{
  priority?: string;
  queue?: boolean;
  calm?: boolean;
  delayMs?: number;
  language?: string;
  pitch?: number;
  spellOut?: boolean;
  punctuation?: boolean;
  ipaNotation?: string;
}>;

type AnnouncementResult = Readonly<{
  id: string;
  // 'spoken'    — VoiceOver confirmed full speech (iOS direct only)
  // 'fired'     — posted to screen reader; no completion confirmation
  // 'cancelled' — explicitly cancelled via cancel() / cancelAll()
  status: string;
}>;

export interface Spec extends TurboModule {
  /** Enqueues a screen reader announcement. Resolves with AnnouncementResult. */
  announce(
    message: string,
    options?: AnnounceOptions
  ): Promise<AnnouncementResult>;
  /** Cancels a specific announcement by its id. Resolves with the cancelled item's result. */
  cancel(id: string): Promise<AnnouncementResult>;
  /** Drains the queue and interrupts current speech. */
  cancelAll(): Promise<AnnouncementResult>;
}

export default TurboModuleRegistry.get<Spec>('A11yAnnounceModule');
