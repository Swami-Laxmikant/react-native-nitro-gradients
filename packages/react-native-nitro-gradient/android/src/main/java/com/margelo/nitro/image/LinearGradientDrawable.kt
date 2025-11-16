package com.margelo.nitro.gradient

import android.graphics.Canvas
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.Shader
import android.graphics.drawable.Drawable

class LinearGradientDrawable : Drawable() {
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var shader: Shader? = null
    private var isDirty = true
    private var lastBoundsWidth = 0
    private var lastBoundsHeight = 0

    private var colorInts: IntArray = intArrayOf()
    private var colorPositions: FloatArray? = null
    private var startX = 0f
    private var startY = 0f
    private var endX = 1f
    private var endY = 0f

    fun setColors(colors: DoubleArray) {
        if (!colorInts.contentEquals(colors.map { it.toInt() }.toIntArray())) {
            colorInts = colors.map { it.toInt() }.toIntArray()
            isDirty = true
        }
    }

    fun setPositions(positions: FloatArray?) {
        if (!colorPositions.contentEquals(positions)) {
            colorPositions = positions
            isDirty = true
        }
    }

    fun setStart(start: VectorR, width: Int, height: Int) {
        val x = toCoordinate(start.x, width)
        val y = toCoordinate(start.y, height)
        if (startX != x || startY != y) {
            startX = x
            startY = y
            isDirty = true
        }
    }

    fun setEnd(end: VectorR, width: Int, height: Int) {
        val x = toCoordinate(end.x, width)
        val y = toCoordinate(end.y, height)
        if (endX != x || endY != y) {
            endX = x
            endY = y
            isDirty = true
        }
    }
    
    private fun toCoordinate(variant: Variant_String_Double, dimension: Int): Float {
        return when (variant) {
            is Variant_String_Double.First -> {
                val s = variant.value
                // Handle percentage strings: "50%", "50w%", "50h%"
                when {
                    s.endsWith("w%") -> {
                        val num = s.dropLast(2).toFloatOrNull() ?: 0f
                        num * 0.01f
                    }
                    s.endsWith("h%") -> {
                        val num = s.dropLast(2).toFloatOrNull() ?: 0f
                        num * 0.01f
                    }
                    s.endsWith("%") -> {
                        val num = s.dropLast(1).toFloatOrNull() ?: 0f
                        num * 0.01f
                    }
                    else -> 0f
                }
            }
            is Variant_String_Double.Second -> {
                // Numeric values are absolute pixels, convert to normalized (0-1)
                if (dimension > 0) {
                    variant.value.toFloat() / dimension.toFloat()
                } else {
                    0f
                }
            }
        }
    }
    
    fun invalidate() {
        if (isDirty) {
            rebuildShader(bounds)
            invalidateSelf()
        }
    }

    override fun onBoundsChange(bounds: Rect) {
        super.onBoundsChange(bounds)
        if (bounds.width() != lastBoundsWidth || bounds.height() != lastBoundsHeight) {
            isDirty = true
            lastBoundsWidth = bounds.width()
            lastBoundsHeight = bounds.height()
        }
    }

    private fun rebuildShader(bounds: Rect) {
        if (colorInts.isEmpty()) {
            shader = null
            isDirty = false
            return
        }
        val width = bounds.width().toFloat()
        val height = bounds.height().toFloat()
        if (width == 0f || height == 0f) return
        
        val x0 = bounds.left + startX * width
        val y0 = bounds.top + startY * height
        val x1 = bounds.left + endX * width
        val y1 = bounds.top + endY * height
        
        shader = LinearGradient(
            x0, y0, x1, y1,
            colorInts,
            colorPositions,
            Shader.TileMode.CLAMP
        )
        paint.shader = shader
        isDirty = false
    }

    override fun draw(canvas: Canvas) {
        if (isDirty || paint.shader == null) rebuildShader(bounds)
        if (paint.shader == null) return
        canvas.drawRect(bounds, paint)
    }

    override fun setAlpha(alpha: Int) {
        paint.alpha = alpha
        invalidateSelf()
    }

    override fun getOpacity(): Int {
        return android.graphics.PixelFormat.TRANSLUCENT
    }

    override fun setColorFilter(colorFilter: android.graphics.ColorFilter?) {
        paint.colorFilter = colorFilter
        invalidateSelf()
    }
}


