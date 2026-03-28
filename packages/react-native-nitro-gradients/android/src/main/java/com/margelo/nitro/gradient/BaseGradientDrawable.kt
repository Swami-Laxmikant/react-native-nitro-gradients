package com.margelo.nitro.gradient

import android.graphics.BlurMaskFilter
import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Rect
import android.graphics.drawable.Drawable

abstract class BaseGradientDrawable : Drawable() {
    protected val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var lastBoundsWidth = 0
    private var lastBoundsHeight = 0

    fun invalidate() {
        updateShader()
        invalidateSelf()
    }

    protected abstract fun updateShader()

    override fun onBoundsChange(bounds: Rect) {
        super.onBoundsChange(bounds)
        if (bounds.width() != lastBoundsWidth || bounds.height() != lastBoundsHeight) {
            lastBoundsWidth = bounds.width()
            lastBoundsHeight = bounds.height()
        }
    }

    override fun draw(canvas: Canvas) {
        if (paint.shader == null) updateShader()
        if (paint.shader != null) canvas.drawRect(bounds, paint)
    }

    override fun setAlpha(alpha: Int) {
        paint.alpha = alpha
        invalidateSelf()
    }

    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT

    override fun setColorFilter(colorFilter: ColorFilter?) {
        paint.colorFilter = colorFilter
        invalidateSelf()
    }
}
