#include "NativeFilterModule.h"

namespace facebook::react {

NativeFilterModule::NativeFilterModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeFilterModuleCxxSpec(std::move(jsInvoker)) {}

std::string NativeFilterModule::reverseString(jsi::Runtime& rt, std::string input) {
  return std::string(input.rbegin(), input.rend());
}

} // namespace facebook::react