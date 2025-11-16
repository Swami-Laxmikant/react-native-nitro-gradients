package com.margelo.nitro.image

import android.graphics.PointF
import com.margelo.nitro.gradient.Variant_String_Double
import com.margelo.nitro.gradient.VectorR

typealias Float2 = PointF

//fun toFloat2(value: VectorR, width: Int, height: Int, density: Float): Float2 {
//    val xPx = when (val vx = value.x) {
//        is Variant_String_Double.First -> {
//            val sx = vx.value
//            val lenX = sx.length
//
//            if (lenX > 1 && sx[lenX - 1] == '%') {
//                val secondLastX = if (lenX > 2) sx[lenX - 2] else '\u0000'
//                val endIdxX = if (secondLastX == 'w' || secondLastX == 'h') lenX - 2 else lenX - 1
//                val numX = sx.substring(0, endIdxX).toFloatOrNull() ?: 0f
//                val factorX = numX * 0.01f
//
//                when (secondLastX) {
//                    'w' -> width * factorX
//                    'h' -> height * factorX
//                    else -> width * factorX
//                }
//            } else {
//                0f
//            }
//        }
//        is Variant_String_Double.Second -> vx.value.toFloat() * density
//    }
//
//    val yPx = when (val vy = value.y) {
//        is Variant_String_Double.First -> {
//            val sy = vy.value
//            val lenY = sy.length
//
//            if (lenY > 1 && sy[lenY - 1] == '%') {
//                val secondLastY = if (lenY > 2) sy[lenY - 2] else '\u0000'
//                val endIdxY = if (secondLastY == 'w' || secondLastY == 'h') lenY - 2 else lenY - 1
//                val numY = sy.substring(0, endIdxY).toFloatOrNull() ?: 0f
//                val factorY = numY * 0.01f
//
//                when (secondLastY) {
//                    'w' -> width * factorY
//                    'h' -> height * factorY
//                    else -> height * factorY
//                }
//            } else {
//                0f
//            }
//        }
//        is Variant_String_Double.Second -> vy.value.toFloat() * density
//    }
//
//    return PointF(xPx, yPx)
//}


fun toFloat2(value: VectorR, width: Int, height: Int, density: Float): Float2 {
    val xPx = parseCoordinate(value.x, width, height, density, width)
    val yPx = parseCoordinate(value.y, width, height, density, height)
    return PointF(xPx, yPx)
}

private fun parseCoordinate(
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