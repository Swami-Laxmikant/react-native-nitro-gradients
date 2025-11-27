package com.margelo.nitro.gradient

sealed interface OptionalVariant<out T> {
    data object NotProvided : OptionalVariant<Nothing>
    data class Provided<T>(val value: T?) : OptionalVariant<T>
}

fun Variant_NullType_DoubleArray?.asOptionalDoubleArray(): OptionalVariant<DoubleArray> =
    when (this) {
        null -> OptionalVariant.NotProvided
        is Variant_NullType_DoubleArray.First -> OptionalVariant.Provided(null)
        is Variant_NullType_DoubleArray.Second -> OptionalVariant.Provided(this.value)
    }

