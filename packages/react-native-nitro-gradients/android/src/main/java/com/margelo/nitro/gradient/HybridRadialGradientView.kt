package com.margelo.nitro.gradient

import android.content.Context
import android.graphics.RadialGradient
import android.graphics.Shader
import android.view.View
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import kotlin.math.min



class RadialGradientDrawable : BaseGradientDrawable() {
    private var tileMode = Shader.TileMode.CLAMP
    private var colors: IntArray = intArrayOf()
    private var positions: FloatArray? = null
    private var center: Float2 = Float2(0f, 0f)
    private var radius: Float = 0f

    fun setColors(rnColors: DoubleArray) {
        colors = IntArray(rnColors.size) { rnColors[it].toInt() }
    }

    fun setPositions(values: DoubleArray) {
        positions = if (values.isEmpty()) null else FloatArray(values.size) { values[it].toFloat() }
    }

    fun setCenter(value: Float2) {
        center = value
    }

    fun setTileMode(value: Shader.TileMode) {
        tileMode = value
    }

    fun setRadius(value: Float) {
        radius = value
    }

    override fun updateShader() {
        val b = bounds
        if (b.width() == 0 || b.height() == 0 || colors.isEmpty()) return

        val cx = b.left + center.x
        val cy = b.top + center.y
        val r = if (radius <= 0f) 0.0001f else radius // TODO: check if needed?

        paint.shader = RadialGradient(cx, cy, r, colors, positions, tileMode)
    }
}

@DoNotStrip
@Keep
class HybridRadialGradientView(context: Context): HybridRadialGradientViewSpec() {
    private val gradientDrawable = RadialGradientDrawable()
    val gradientView = View(context)
    override val view: View = gradientView
    private val density = context.resources.displayMetrics.density
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
                updateGradientProperties(w, h)
                invalidate()
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
                applyBlurToView(gradientView, value, tileMode)
            }
        }

    override var tileMode: String? = null
        set(value) {
            if (field != value) {
                field = value
                gradientDrawable.setTileMode(value.toTileMode())
                applyBlurToView(gradientView, blur, value)
            }
        }

    override var colors: DoubleArray = doubleArrayOf()
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setColors(value)
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setPositions(value ?: doubleArrayOf())
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
                }
            }
        }

    override fun update(
        colors: DoubleArray,
        positions: DoubleArray?,
        center: Vector?,
        radius: Variant_String_Double?,
        blur: Double?,
        tileMode: String?
    ) {
        beforeUpdate()
        try {
            this.colors = colors
            this.positions = positions
            this.center = center
            this.radius = radius
            this.blur = blur
            this.tileMode = tileMode
        } finally {
            afterUpdate()
        }
    }
}
