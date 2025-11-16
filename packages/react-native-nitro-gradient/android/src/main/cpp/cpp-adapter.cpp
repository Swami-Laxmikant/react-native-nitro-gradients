#include <jni.h>
#include "NitroGradientOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::gradient::initialize(vm);
}
