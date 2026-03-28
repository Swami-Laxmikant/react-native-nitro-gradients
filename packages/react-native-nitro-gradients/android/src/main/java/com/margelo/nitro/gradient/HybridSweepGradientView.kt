package com.margelo.nitro.gradient

import android.content.Context
import android.graphics.Matrix
import android.graphics.SweepGradient
import android.view.View
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

class SweepGradientDrawable : BaseGradientDrawable() {
    private var centre = Float2(0f, 0f)
    private var colors = intArrayOf()
    private var positions: FloatArray? = null
    private var startAngle = 0f
    private val matrix = Matrix()

    fun setColors(rnColors: IntArray) {
        colors = rnColors
    }

    fun setPositions(newPositions: FloatArray?) {
        positions = newPositions
    }

    fun setCentre(newCentre: Float2) {
        centre = newCentre
    }

    override fun updateShader() {
        val b = bounds
        val w = b.width()
        val h = b.height()
        if (w == 0 || h == 0 || colors.isEmpty()) return

        val cx = b.left + centre.x
        val cy = b.top + centre.y

        val shader = SweepGradient(cx, cy, colors, positions)

        if (startAngle != 0f) {
            matrix.reset()
            matrix.postRotate(startAngle, cx, cy)
            shader.setLocalMatrix(matrix)
        }

        paint.shader = shader
    }
}

@DoNotStrip
@Keep
class HybridSweepGradientView(context: Context) : HybridSweepGradientViewSpec() {
    private val gradientDrawable = SweepGradientDrawable()
    private val density = context.resources.displayMetrics.density
    private val gradientView = View(context)
    override val view: View = gradientView
    private val defaultCenter = Vector(
        x = Variant_String_Double.First("50%"),
        y = Variant_String_Double.First("50%")
    )
    private var isBatching = false

    override fun beforeUpdate() { isBatching = true }
    override fun afterUpdate() {
        isBatching = false
        gradientDrawable.invalidate()
    }

    private fun invalidate() {
        if (!isBatching) gradientDrawable.invalidate()
    }

    init {
        gradientView.background = gradientDrawable
        gradientView.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val w = gradientView.width
            val h = gradientView.height
            if (w > 0 && h > 0) {
                updateCenter(center)
                invalidate()
            }
        }
    }

    private fun updateCenter(value: Vector?) {
        val w = gradientView.width
        val h = gradientView.height
        if (w > 0 && h > 0) {
            gradientDrawable.setCentre(toFloat2(value ?: defaultCenter, w, h, density))
        }
    }

    override var blur: Double? = null
        set(value) {
            if (field != value) {
                field = value
                applyBlurToView(gradientView, value, tileMode)
            }
        }

    override var tileMode: String? = null
        set(value) {
            if (field != value) {
                field = value
                applyBlurToView(gradientView, blur, value)
            }
        }

    override var colors: DoubleArray = DoubleArray(0)
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setColors(IntArray(value.size) { value[it].toInt() }) // TODO: streamline across the grads
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                val newPositions = value?.let { FloatArray(it.size) { i -> it[i].toFloat() } }
                gradientDrawable.setPositions(newPositions)
            }
        }

    override var center: Vector? = Vector(
        x = Variant_String_Double.First("50%"),
        y = Variant_String_Double.First("50%")
    )
        set(value) {
            if (field != value) {
                field = value
                updateCenter(value)
            }
        }

    override fun update(
        colors: DoubleArray,
        positions: DoubleArray?,
        center: Vector?,
        blur: Double?,
        tileMode: String?
    ) {
        beforeUpdate()
        try {
            this.colors = colors
            this.positions = positions
            this.center = center
            this.blur = blur
            this.tileMode = tileMode
        } finally {
            afterUpdate()
        }
    }
}
