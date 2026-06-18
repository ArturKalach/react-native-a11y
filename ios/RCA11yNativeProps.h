//
//  RCA11yNativeProps.h
//  react-native-a11y
//
//  Fabric props snapshots for the merged A11yView, ported from
//  react-native-external-keyboard's RNCEKVNativeProps (namespace RNCEKV → RCA11y).
//  Each struct mirrors a slice of the codegen `A11yView` props so the native view
//  can read a stable, typed copy regardless of arch.
//

#pragma once

#include <string>

namespace RCA11y {

struct OrderProps {
  std::string orderGroup{};
  int orderIndex{0};
  int lockFocus{0};
  std::string orderId{};
  std::string orderLeft{};
  std::string orderRight{};
  std::string orderUp{};
  std::string orderDown{};
  std::string orderForward{};
  std::string orderBackward{};
  std::string orderFirst{};
  std::string orderLast{};

  template <typename T>
  static OrderProps from(const T &props) {
    return OrderProps{
      props.orderGroup,
      props.orderIndex,
      props.lockFocus,
      props.orderId,
      props.orderLeft,
      props.orderRight,
      props.orderUp,
      props.orderDown,
      props.orderForward,
      props.orderBackward,
      props.orderFirst,
      props.orderLast,
    };
  }
};



struct HaloProps {
  bool haloEffect{true};
  double haloExpendX{0};
  double haloExpendY{0};
  double haloCornerRadius{0};
  facebook::react::SharedColor tintColor{};
  bool roundedHaloFix{false};

  template <typename T>
  static HaloProps from(const T &props) {
    return HaloProps{
      props.haloEffect,
      props.haloExpendX,
      props.haloExpendY,
      props.haloCornerRadius,
      props.tintColor,
      props.roundedHaloFix,
    };
  }
};

struct GroupIdentifierProps {
  std::string groupIdentifier{};

  template <typename T>
  static GroupIdentifierProps from(const T &props) {
    return GroupIdentifierProps{
      props.groupIdentifier,
    };
  }
};

struct FocusProps {
  bool canBeFocused{false};
  bool hasOnFocusChanged{false};

  template <typename T>
  static FocusProps from(const T &props) {
    return FocusProps{
      props.canBeFocused,
      props.hasOnFocusChanged
    };
  }
};


struct ContextMenuProps {
  bool enableContextMenu{false};

  template <typename T>
  static ContextMenuProps from(const T &props) {
    return ContextMenuProps{
      props.enableContextMenu,
    };
  }
};

struct AutoFocusProps {
  bool autoFocus{false};

  template <typename T>
  static AutoFocusProps from(const T &props) {
    return AutoFocusProps{
      props.autoFocus,
    };
  }
};

struct KeyPressProps {
  bool hasKeyDownPress{false};
  bool hasKeyUpPress{false};

  template <typename T>
  static KeyPressProps from(const T &props) {
    return KeyPressProps{
      props.hasKeyDownPress,
      props.hasKeyUpPress,
    };
  }
};

} // namespace RCA11y
