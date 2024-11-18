#include "NativeFilterModule.h"

namespace facebook::react {

NativeFilterModule::NativeFilterModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeFilterModuleCxxSpec(std::move(jsInvoker)) {}

std::string NativeFilterModule::reverseString(jsi::Runtime& rt, std::string input) {
  return std::string(input.rbegin(), input.rend());
}

std::vector<double> NativeFilterModule::testArray(jsi::Runtime &rt, std::vector<double> data) {
  std::vector<double> output {};
  for (double value : data) {
    output.push_back(value * 3);
  }
  return output;
}

std::vector<double> NativeFilterModule::notchFilter(jsi::Runtime& rt, std::vector<double> signal, 
   double fs, double notch_freq, double bandwidth) {
    // Calculate normalized parameters
    double omega = 2.0 * M_PI * notch_freq / fs; // Notch frequency in radians
    double bw = 2.0 * M_PI * bandwidth / fs;    // Bandwidth in radians
    double alpha = sin(omega) * sinh(log(2.0) / 2.0 * bw / sin(omega));

    // Filter coefficients
    double b0 = 1.0;
    double b1 = -2.0 * cos(omega);
    double b2 = 1.0;
    double a0 = 1.0 + alpha;
    double a1 = -2.0 * cos(omega);
    double a2 = 1.0 - alpha;

    // Normalize coefficients
    b0 /= a0;
    b1 /= a0;
    b2 /= a0;
    a1 /= a0;
    a2 /= a0;

    // Temporary variables to store previous inputs and outputs
    double x1 = 0.0, x2 = 0.0; // Previous inputs
    double y1 = 0.0, y2 = 0.0; // Previous outputs

    std::vector<double> output {};
    for (double x0 : signal) {
        double y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;

        // Update states
        x2 = x1;
        x1 = x0;
        y2 = y1;
        y1 = y0;

        output.push_back(y0);
    }
    return output;
}

std::vector<double> NativeFilterModule::lowPassFilter(jsi::Runtime& rt, std::vector<double> signal, 
  double fs, double lp_freq) {
    // Pre-warped angular frequency for the bilinear transform
    double omega_c = 2.0 * M_PI * lp_freq;
    double tan_wc = tan(omega_c / (2.0 * fs));

    // Butterworth filter coefficients for second-order filter
    double a0 = 1.0 / (1.0 + sqrt(2.0) * tan_wc + tan_wc * tan_wc);
    double a1 = 2.0 * a0;
    double a2 = a0;
    double b1 = 2.0 * (tan_wc * tan_wc - 1.0) * a0;
    double b2 = (1.0 - sqrt(2.0) * tan_wc + tan_wc * tan_wc) * a0;

    // Temporary variables to store previous inputs and outputs
    double x1 = 0.0, x2 = 0.0; // Previous inputs
    double y1 = 0.0, y2 = 0.0; // Previous outputs

    std::vector<double> output {};
    for (double x0 : signal) {
        double y0 = a0 * x0 + a1 * x1 + a2 * x2 - b1 * y1 - b2 * y2;

        // Update states
        x2 = x1;
        x1 = x0;
        y2 = y1;
        y1 = y0;

        output.push_back(y0);
    }
    return output;
}

std::vector<double> NativeFilterModule::highPassFilter(jsi::Runtime& rt, std::vector<double> signal, 
  double fs, double hp_freq) {
    // Pre-warped angular frequency for the bilinear transform
    double omega_c = 2.0 * M_PI * hp_freq;
    double tan_wc = tan(omega_c / (2.0 * fs));

    // Butterworth filter coefficients for second-order filter
    double a0 = 1.0 / (1.0 + sqrt(2.0) * tan_wc + tan_wc * tan_wc);
    double a1 = -2.0 * a0;
    double a2 = a0;
    double b1 = 2.0 * (tan_wc * tan_wc - 1.0) * a0;
    double b2 = (1.0 - sqrt(2.0) * tan_wc + tan_wc * tan_wc) * a0;

    // Temporary variables to store previous inputs and outputs
    double x1 = 0.0, x2 = 0.0; // Previous inputs
    double y1 = 0.0, y2 = 0.0; // Previous outputs

    std::vector<double> output {};
    for (double x0 : signal) {
        double y0 = a0 * x0 + a1 * x1 + a2 * x2 - b1 * y1 - b2 * y2;

        // Update states
        x2 = x1;
        x1 = x0;
        y2 = y1;
        y1 = y0;

        // Store the filtered output
        output.push_back(y0);
    }
    return output;
}

} // namespace facebook::react