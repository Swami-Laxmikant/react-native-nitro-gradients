package com.margelo.nitro.gradient

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.SweepGradient
import android.graphics.drawable.Drawable
import android.view.View
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.gradient.Float2
import com.margelo.nitro.gradient.toFloat2

class SweepGradientDrawable: Drawable() {
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var centre = Float2(0f, 0f)
    private var colors = intArrayOf(Color.BLACK, Color.WHITE)
    private var positions: FloatArray? = null
    private var startAngle = 0f
    private var isDirty = true
    private var lastBoundsWidth = 0
    private var lastBoundsHeight = 0
    private val matrix = Matrix()

    fun setColors(rnColors: IntArray) {
        if (!colors.contentEquals(rnColors)) {
            colors = if (rnColors.isEmpty()) intArrayOf(Color.BLACK, Color.WHITE) else rnColors
            isDirty = true
        }
    }

    fun setPositions(newPositions: FloatArray?) {
        if (!positions.contentEquals(newPositions)) {
            positions = newPositions
            isDirty = true
        }
    }

    fun setCentre(newCentre: Float2) {
        if (centre.x != newCentre.x || centre.y != newCentre.y) {
            centre = newCentre
            isDirty = true
        }
    }

    fun setStartAngle(angle: Float) {
        if (startAngle != angle) {
            startAngle = angle
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
        val w = b.width()
        val h = b.height()
        if (w == 0 || h == 0) return

        val cx = b.left + centre.x
        val cy = b.top + centre.y

        val shader = SweepGradient(cx, cy, colors, positions)

        if (startAngle != 0f) {
            matrix.reset()
            matrix.postRotate(startAngle, cx, cy)
            shader.setLocalMatrix(matrix)
        }

        paint.shader = shader
        isDirty = false
        lastBoundsWidth = w
        lastBoundsHeight = h
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

    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT

    override fun setAlpha(alpha: Int) {
        if (paint.alpha != alpha) {
            paint.alpha = alpha
            invalidateSelf()
        }
    }

    override fun setColorFilter(cf: ColorFilter?) {
        if (paint.colorFilter != cf) {
            paint.colorFilter = cf
            invalidateSelf()
        }
    }
}

@DoNotStrip
@Keep
class HybridSweepGradientView(context: Context) : HybridSweepGradientViewSpec() {
    private val gradientDrawable = SweepGradientDrawable()
    private val density = context.resources.displayMetrics.density
    private val gradientView = View(context)
    override val view: View = gradientView
    private var cachedColors: IntArray? = null
    private var isLayoutValid = false

    init {
        gradientView.background = gradientDrawable
        gradientView.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val w = gradientView.width
            val h = gradientView.height
            if (w > 0 && h > 0 && !isLayoutValid) {
                isLayoutValid = true
                center?.let {
                    gradientDrawable.setCentre(toFloat2(it, w, h, density))
                }
                gradientDrawable.invalidate()
            }
        }
    }

    private fun updateCenter(value: VectorR) {
        val w = gradientView.width
        val h = gradientView.height
        if (w > 0 && h > 0) {
            gradientDrawable.setCentre(toFloat2(value, w, h, density))
        }
    }

    override var colors: DoubleArray = DoubleArray(0)
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                val newColors = if (value.isEmpty()) intArrayOf(Color.BLACK, Color.WHITE)
                else IntArray(value.size) { value[it].toInt() }

                if (!cachedColors.contentEquals(newColors)) {
                    cachedColors = newColors
                    gradientDrawable.setColors(newColors)
                    gradientDrawable.invalidate()
                }
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                val newPositions = value?.let { FloatArray(it.size) { i -> it[i].toFloat() } }
                gradientDrawable.setPositions(newPositions)
                gradientDrawable.invalidate()
            }
        }

    override var center: VectorR? = VectorR(
        x = Variant_String_Double.First("50%"),
        y = Variant_String_Double.First("50%")
    )
        set(value) {
            if (field != value) {
                field = value
                if (value != null) {
                    updateCenter(value)
                } else {
                    gradientDrawable.setCentre(Float2(0f, 0f))
                }
                gradientDrawable.invalidate()
            }
        }

    override var startAngle: Double? = 0.0
        set(value) {
            val newValue = value ?: 0.0
            if (field != newValue) {
                field = newValue
                gradientDrawable.setStartAngle(newValue.toFloat())
                gradientDrawable.invalidate()
            }
        }

    override var endAngle: Double? = null

    override fun update(
        colors: Variant_NullType_DoubleArray?,
        positions: DoubleArray?,
        center: VectorR?,
        startAngle: Double?,
        endAngle: Double?
    ) {
        var changed = false

        when (val colorsArg = colors.asOptionalDoubleArray()) {
            is OptionalVariant.Provided -> {
                val nextColors = colorsArg.value ?: doubleArrayOf()
                if (!this.colors.contentEquals(nextColors)) {
                    this.colors = nextColors
                    val newColors = if (nextColors.isEmpty()) intArrayOf(Color.BLACK, Color.WHITE)
                    else IntArray(nextColors.size) { i -> nextColors[i].toInt() }

                    if (!cachedColors.contentEquals(newColors)) {
                        cachedColors = newColors
                        gradientDrawable.setColors(newColors)
                    }
                    changed = true
                }
            }
            OptionalVariant.NotProvided -> Unit
        }

        positions?.let {
            if (!this.positions.contentEquals(it)) {
                this.positions = it
                val newPositions = FloatArray(it.size) { i -> it[i].toFloat() }
                gradientDrawable.setPositions(newPositions)
                changed = true
            }
        }

        center?.let {
            if (this.center != it) {
                this.center = it
                changed = true
            }
        }

        startAngle?.let {
            if (this.startAngle != it) {
                this.startAngle = it
                gradientDrawable.setStartAngle(it.toFloat())
                changed = true
            }
        }

        if (changed) {
            gradientDrawable.invalidate()
        }
    }
}
