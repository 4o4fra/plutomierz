import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme.colorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.LineData

@Composable
fun PlutaChart(lineData: LineData) {
    val primaryColor = colorScheme.primary.toArgb()
    AndroidView(
        factory = { context ->
            LineChart(context).apply {
                data = lineData
                description.isEnabled = false
                xAxis.setDrawLabels(false)
                axisRight.isEnabled = false
                setTouchEnabled(false)
                setPinchZoom(false)
                axisLeft.textColor = primaryColor
                xAxis.textColor = primaryColor
            }
        },
        modifier = Modifier
            .height(300.dp)
            .fillMaxWidth()
    )
}