package com.margelo.nitro.gradient

import android.graphics.PointF
import com.margelo.nitro.gradient.Variant_String_Double
import com.margelo.nitro.gradient.Vector

typealias Float2 = PointF

fun toFloat2(value: Vector, width: Int, height: Int, density: Float): Float2 {
    val xPx = parseCoordinate(value.x, width, height, density, width)
    val yPx = parseCoordinate(value.y, width, height, density, height)
    return PointF(xPx, yPx)
}

fun parseCoordinate(
    variant: Variant_String_Double,
    width: Int,
    height: Int,
    density: Float,
    factorMultiplier: Int
): Float {
    return when (variant) {
        is Variant_String_Double.First -> {
            val s = variant.value
            val len = s.length

            if (len > 1 && s[len - 1] == '%') {
                val secondLast = if (len > 2) s[len - 2] else '\u0000'
                val endIdx = if (secondLast == 'w' || secondLast == 'h') len - 2 else len - 1
                val num = s.substring(0, endIdx).toFloatOrNull() ?: 0f
                val factor = num * 0.01f

                when (secondLast) {
                    'w' -> width * factor
                    'h' -> height * factor
                    else -> factorMultiplier * factor
                }
            } else {
                0f
            }
        }
        is Variant_String_Double.Second -> variant.value.toFloat() * density
    }
}

fun toFloat1(value: Variant_String_Double, width: Int, height: Int, density: Float): Float {
    return parseCoordinate(value, width, height, density, width)
}