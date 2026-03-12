package com.margelo.nitro.gradient

import android.content.Context
import android.graphics.BlurMaskFilter
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.RadialGradient
import android.graphics.Shader
import android.graphics.drawable.Drawable
import android.view.View
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import com.margelo.nitro.gradient.Float2
import com.margelo.nitro.gradient.toFloat2
import com.margelo.nitro.gradient.toFloat1
import kotlin.math.min

class RadialGradientDrawable(): Drawable() {
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var tileMode = Shader.TileMode.CLAMP

    private var colors: IntArray = intArrayOf(Color.TRANSPARENT, Color.TRANSPARENT)
    private var positions: FloatArray? = null
    private var center: Float2 = Float2(0f, 0f)
    private var radius: Float = 0f
    private var isDirty = true
    private var lastBoundsWidth = 0
    private var lastBoundsHeight = 0

    fun setColors(nums: DoubleArray) {
        val newColors = if (nums.isEmpty()) intArrayOf(Color.TRANSPARENT, Color.TRANSPARENT)
        else IntArray(nums.size) { nums[it].toInt() }

        if (!colors.contentEquals(newColors)) {
            colors = newColors
            isDirty = true
        }
    }

    fun setPositions(values: DoubleArray) {
        val newPositions = if (values.isEmpty()) null else FloatArray(values.size) { values[it].toFloat() }
        if (!positions.contentEquals(newPositions)) {
            positions = newPositions
            isDirty = true
        }
    }

    fun setCenter(value: Float2) {
        if (center.x != value.x || center.y != value.y) {
            center = value
            isDirty = true
        }
    }

    fun setBlur(radius: Float) {
        paint.maskFilter = if (radius > 0f) BlurMaskFilter(radius, BlurMaskFilter.Blur.NORMAL) else null
        isDirty = true
    }

    fun setTileMode(value: Shader.TileMode) {
        if (tileMode != value) {
            tileMode = value
            isDirty = true
        }
    }

    fun setRadius(value: Float) {
        if (radius != value) {
            radius = value
            isDirty = true
        }
    }

    fun invalidate() {
        if (isDirty) {
            updateShader()
            invalidateSelf()
        }
    }

    private fun updateShader() {
        val b = bounds
        if (b.width() == 0 || b.height() == 0) return

        val cx = b.left + center.x
        val cy = b.top + center.y
        val r = if (radius <= 0f) 0.0001f else radius

        paint.shader = RadialGradient(cx, cy, r, colors, positions, tileMode)
        isDirty = false
        lastBoundsWidth = b.width()
        lastBoundsHeight = b.height()
    }

    override fun onBoundsChange(bounds: android.graphics.Rect) {
        super.onBoundsChange(bounds)
        if (bounds.width() != lastBoundsWidth || bounds.height() != lastBoundsHeight) {
            isDirty = true
        }
    }

    override fun draw(canvas: Canvas) {
        if (isDirty || paint.shader == null) updateShader()
        canvas.drawRect(bounds, paint)
    }

    override fun setAlpha(alpha: Int) {
        if (paint.alpha != alpha) {
            paint.alpha = alpha
            invalidateSelf()
        }
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
        if (paint.colorFilter != colorFilter) {
            paint.colorFilter = colorFilter
            invalidateSelf()
        }
    }

    @Deprecated("Deprecated in Java")
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
}

@DoNotStrip
@Keep
class HybridRadialGradientView(context: Context): HybridRadialGradientViewSpec() {
    private val gradientDrawable = RadialGradientDrawable()
    val gradientView = View(context)
    override val view: View = gradientView
    private val density = context.resources.displayMetrics.density
    private var isLayoutValid = false
    private var updateDepth = 0
    private var hasPendingInvalidate = false

    private fun invalidateGradient() {
        if (updateDepth > 0) {
            hasPendingInvalidate = true
        } else {
            gradientDrawable.invalidate()
        }
    }

    override fun beforeUpdate() {
        updateDepth += 1
    }

    override fun afterUpdate() {
        if (updateDepth == 0) {
            return
        }

        updateDepth -= 1
        if (updateDepth == 0 && hasPendingInvalidate) {
            hasPendingInvalidate = false
            gradientDrawable.invalidate()
        }
    }

    init {
        gradientView.background = gradientDrawable
        gradientView.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val w = gradientView.width
            val h = gradientView.height
            if (w > 0 && h > 0 && !isLayoutValid) {
                isLayoutValid = true
                updateGradientProperties(w, h)
                invalidateGradient()
            }
        }
    }

    private fun updateGradientProperties(w: Int, h: Int) {
        if (w == 0 || h == 0) return

        gradientDrawable.setCenter(
            center?.let { toFloat2(it, w, h, density) } ?: Float2(w / 2f, h / 2f)
        )

        gradientDrawable.setRadius(
            radius?.let { toFloat1(it, w, h, density) } ?: (min(w, h) / 2f)
        )
    }

    override var blur: Double? = null
        set(value) {
            if (field != value) {
                field = value
                applyBlurToView(
                    gradientView,
                    value,
                    tileMode,
                    gradientDrawable::setBlur,
                    ::invalidateGradient
                )
            }
        }

    override var tileMode: String? = null
        set(value) {
            if (field != value) {
                field = value
                gradientDrawable.setTileMode(value.toTileMode())
                applyBlurToView(
                    gradientView,
                    blur,
                    value,
                    gradientDrawable::setBlur,
                    ::invalidateGradient
                )
            }
        }

    override var colors: DoubleArray = doubleArrayOf()
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setColors(value)
                invalidateGradient()
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setPositions(value ?: doubleArrayOf())
                invalidateGradient()
            }
        }

    override var center: Vector? = null
        set(value) {
            if (field != value) {
                field = value
                val w = gradientView.width
                val h = gradientView.height
                if (w > 0 && h > 0) {
                    gradientDrawable.setCenter(
                        value?.let { toFloat2(it, w, h, density) } ?: Float2(w / 2f, h / 2f)
                    )
                    invalidateGradient()
                }
            }
        }

    override var radius: Variant_String_Double? = null
        set(value) {
            if (field != value) {
                field = value
                val w = gradientView.width
                val h = gradientView.height
                if (w > 0 && h > 0) {
                    gradientDrawable.setRadius(
                        value?.let { toFloat1(it, w, h, density) } ?: (min(w, h) / 2f)
                    )
                    invalidateGradient()
                }
            }
        }

    override fun update(
        colors: Variant_NullType_DoubleArray?,
        positions: DoubleArray?,
        center: Vector?,
        radius: Variant_String_Double?,
        blur: Double?,
        tileMode: String?
    ) {
        beforeUpdate()
        try {
            var changed = false

            when (val colorsArg = colors.asOptionalDoubleArray()) {
                is OptionalVariant.Provided -> {
                    val nextColors = colorsArg.value ?: doubleArrayOf()
                    if (!this.colors.contentEquals(nextColors)) {
                        this.colors = nextColors
                        changed = true
                    }
                }
                OptionalVariant.NotProvided -> Unit
            }

            if (!this.positions.contentEquals(positions)) {
                this.positions = positions
                changed = true
            }

            if (this.center != center) {
                this.center = center
                changed = true
            }

            if (this.radius != radius) {
                this.radius = radius
                changed = true
            }

            if (this.blur != blur) {
                this.blur = blur
            }

            if (this.tileMode != tileMode) {
                this.tileMode = tileMode
            }

            if (changed) {
                invalidateGradient()
            }
        } finally {
            afterUpdate()
        }
    }
}
