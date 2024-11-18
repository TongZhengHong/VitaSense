#pragma once

#include <AppSpecsJSI.h>

#include <math.h>
#include <memory>
#include <string>
#include <vector>

namespace facebook::react {

class NativeFilterModule : public NativeFilterModuleCxxSpec<NativeFilterModule> {
public:
  NativeFilterModule(std::shared_ptr<CallInvoker> jsInvoker);

  std::string reverseString(jsi::Runtime& rt, std::string input);

  std::vector<double> testArray(jsi::Runtime& rt, std::vector<double> data);

  std::vector<double> notchFilter(jsi::Runtime& rt, std::vector<double> signal, double fs, 
    double notch_freq, double bandwidth);

  std::vector<double> lowPassFilter(jsi::Runtime& rt, std::vector<double> signal, double fs, 
    double lp_freq);

  std::vector<double> highPassFilter(jsi::Runtime& rt, std::vector<double> signal, double fs, 
    double hp_freq);
};

} // namespace facebook::react