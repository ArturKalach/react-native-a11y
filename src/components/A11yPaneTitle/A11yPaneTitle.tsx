import A11yPaneTitleNative from '../../nativeSpecs/A11yPaneTitleNativeComponent';
import type {
  A11yPaneTitleProps,
  A11yPaneType,
  A11yScreenChangeProps,
} from './A11yPaneTitle.types';

const PaneTypeValue: Record<A11yPaneType, number> = {
  activity: 0,
  pane: 1,
  announce: 2,
};

export const A11yPaneTitle = ({
  title,
  detachMessage,
  type = 'pane',
  children,
  displayed,
  withFocusRestore = true,
}: A11yPaneTitleProps) => {
  if (displayed === false) return null;

  return (
    <A11yPaneTitleNative
      title={title}
      detachMessage={detachMessage}
      type={PaneTypeValue[type]}
      children={children}
      withFocusRestore={withFocusRestore}
    />
  );
};

export const A11yScreenChange = (props: A11yScreenChangeProps) => (
  <A11yPaneTitle
    title={props.title}
    detachMessage={props.detachMessage}
    displayed={props.displayed}
    type="activity"
  />
);
