from django.db import models


class EquationPlot(models.Model):
    equation = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return self.equation